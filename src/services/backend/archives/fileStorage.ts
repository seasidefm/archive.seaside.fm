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
    const uploadBucket = process.env.LINODE_S3_UPLOAD_BUCKET,
        uploadKey = process.env.LINODE_S3_UPLOAD_KEY,
        uploadSecret = process.env.LINODE_S3_UPLOAD_SECRET,
        uploadEndpoint = process.env.LINODE_S3_UPLOAD_ENDPOINT;

    if (!uploadBucket || !uploadKey || !uploadSecret || !uploadEndpoint) {
        throw new Error("Cannot find all expected LINODE_S3_* env vars!");
    }

    const unprocessedUploadsBucket: StorageBucket = {
        bucketName: uploadBucket,
        config: {
            endpoint: uploadEndpoint,
            credentials: {
                accessKeyId: uploadKey,
                secretAccessKey: uploadSecret,
            },
        },
    };

    return {
        unprocessedUploadsBucket,
    };
};

export class VideoStorage implements IVideoStorage {
    private storage: Storage;
    private readonly path: string;
    private readonly buckets: Record<"unprocessedUploadsBucket", StorageBucket>;

    constructor(path: string) {
        this.path = path;
        this.storage = new Storage({
            projectId: "",
            credentials: {},
        });

        this.buckets = getStorageConfig();
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

    public async getMetaData(file: string) {
        const f = this.storage.bucket("").file(file);

        return { meta: (await f.getMetadata())[0], file: f };
    }

    public async getStreamChunk(
        file: string,
        range: string
    ): Promise<ArchiveStreamChunk> {
        const { meta, file: fileData } = await this.getMetaData(file);

        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, meta.size - 1);

        const chunkLength = end - start + 1;

        return {
            stream: fileData.createReadStream({
                start,
                end,
            }),
            chunkLength,
            start,
            end,
            videoLength: meta.size,
        };
    }
}
