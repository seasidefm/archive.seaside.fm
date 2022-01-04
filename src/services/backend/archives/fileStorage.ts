import { Storage } from "@google-cloud/storage";
import AWS from "aws-sdk";
import { CredentialsOptions } from "aws-sdk/lib/credentials";

export interface IVideoStorage {
    getUnprocessedUploads(): Promise<unknown>;
}

interface StorageBucket {
    bucketName: string;
    config: {
        endpoint: string;
        credentials: CredentialsOptions;
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
    const uploadBucketName = process.env.LINODE_S3_UPLOAD_BUCKET,
        videosBucketName = process.env.LINODE_S3_VIDEOS_BUCKET,
        s3Key = process.env.LINODE_S3_KEY,
        s3Secret = process.env.LINODE_S3_SECRET,
        s3Endpoint = process.env.LINODE_S3_ENDPOINT;

    if (
        !uploadBucketName ||
        !videosBucketName ||
        !s3Key ||
        !s3Secret ||
        !s3Endpoint
    ) {
        throw new Error("Cannot find all expected LINODE_S3_* env vars!");
    }

    const unprocessedUploadsBucket: StorageBucket = {
        bucketName: uploadBucketName,
        config: {
            endpoint: s3Endpoint,
            credentials: {
                accessKeyId: s3Key,
                secretAccessKey: s3Secret,
            },
        },
    };

    const videosBucket: StorageBucket = {
        bucketName: videosBucketName,
        config: {
            endpoint: s3Endpoint,
            credentials: {
                accessKeyId: s3Key,
                secretAccessKey: s3Secret,
            },
        },
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
