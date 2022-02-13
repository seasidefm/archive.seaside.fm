import { Storage } from "@google-cloud/storage";
import AWS from "aws-sdk";
import { CredentialsOptions } from "aws-sdk/lib/credentials";

export interface IVideoStorage {
    getUnprocessedUploads(): Promise<unknown>;
}

interface StorageBucket {
    bucketName: string;
    config: CredentialsOptions &
        AWS.S3.ClientConfiguration & {
            endpoint: AWS.Endpoint | string;
            s3ForcePathStyle?: boolean;
            signatureVersion?: string;
        };
}

export interface ArchiveStreamChunk<
    S extends NodeJS.ReadableStream = NodeJS.ReadableStream
> {
    stream: S;
    chunkLength: number;
    start: number;
    end: number;
    videoLength: number;
}

const getStorageConfig = () => {
    const uploadBucketName = process.env.UPLOAD_BUCKET,
        videosBucketName = process.env.PROCESSED_BUCKET,
        minioKey = process.env.MINIO_KEY,
        minioSecret = process.env.MINIO_SECRET,
        minioEndpoint = process.env.MINIO_ENDPOINT;
    // UPLOAD_BUCKET = "archive-seasidefm-unprocessed";
    // PROCESSED_BUCKET = "archive-seasidefm-uploads";
    // MINIO_KEY = "seasidefm-nextjs-archive";
    // MINIO_SECRET = "83YCvJKi9DXK9EJ7ew77";
    // MINIO_ENDPOINT = "http://192.168.64.3:9000";

    if (
        !uploadBucketName ||
        !videosBucketName ||
        !minioKey ||
        !minioSecret ||
        !minioEndpoint
    ) {
        throw new Error("Cannot find all expected MINIO env vars!");
    }

    const sharedConfig = {
        s3ForcePathStyle: true, // needed with minio?
        signatureVersion: "v4",
        region: "us-east-1",
        endpoint: new AWS.Endpoint(minioEndpoint),
        accessKeyId: minioKey,
        secretAccessKey: minioSecret,
    };

    const unprocessedUploadsBucket: StorageBucket = {
        bucketName: uploadBucketName,
        config: sharedConfig,
    };

    const videosBucket: StorageBucket = {
        bucketName: videosBucketName,
        config: sharedConfig,
    };

    return {
        unprocessedUploadsBucket,
        videosBucket,
    };
};

export class VideoStorage implements IVideoStorage {
    private storage: Storage;
    private readonly path: string;
    private readonly buckets: Record<
        "unprocessedUploadsBucket" | "videosBucket",
        StorageBucket
    >;
    private readonly unprocessed: AWS.S3;
    private readonly videos: AWS.S3;

    constructor(path: string) {
        this.path = path;
        this.storage = new Storage({
            projectId: "",
            credentials: {},
        });

        this.buckets = getStorageConfig();

        this.unprocessed = new AWS.S3({
            ...this.buckets.unprocessedUploadsBucket.config,
        });

        this.videos = new AWS.S3({
            ...this.buckets.videosBucket.config,
        });
    }

    public async getUnprocessedUploads() {
        const objectStorage = new AWS.S3(
            this.buckets.unprocessedUploadsBucket.config
        );
        const objects = await objectStorage
            .listObjects({
                Bucket: this.buckets.unprocessedUploadsBucket.bucketName,
            })
            .promise();

        return objects.Contents?.map((f) => f.Key) ?? [];
    }

    public async getFileLink(_file: string) {
        // const _defaultReadOptions: GetSignedUrlConfig = {
        //     version: "v4",
        //     action: "read",
        //     expires: Date.now() + 60 * 60 * 1000, // 60 minutes
        // };

        // const [url] = await this.storage
        //     .bucket(this.bucket)
        //     .file(file)
        //     .getSignedUrl(defaultReadOptions);

        return "url";
    }

    public async getVideoMetaData(file: string) {
        const s3 = this.videos;

        const meta = await s3
            .headObject({
                Bucket: this.buckets.videosBucket.bucketName,
                Key: file,
            })
            .on("httpError", (e) => console.log(e))
            .promise();

        return {
            meta: {
                size: meta.ContentLength,
            },
        };
    }

    public async getStreamChunk(
        file: string,
        range: string
    ): Promise<ArchiveStreamChunk> {
        console.log("Getting video chunk!");
        const s3 = this.videos;

        const { meta } = await this.getVideoMetaData(file);

        if (!meta.size || meta.size == 0) {
            throw new Error(`Cannot read an empty file! '${file}'`);
        }

        // Roughly 2MiB
        const CHUNK_SIZE = 3_000_000;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, meta.size - 1);

        const chunkLength = end - start + 1;

        console.log(`Serving bytes: ${start}-${end}/${meta.size}`);

        const fileChunk = await s3.getObject({
            Bucket: this.buckets.videosBucket.bucketName,
            Key: file,
            Range: `bytes=${start}-${end}`,
        });

        return {
            stream: fileChunk.createReadStream(),
            chunkLength,
            start,
            end,
            videoLength: meta.size,
        };
    }
}
