import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import { Buffer } from "buffer";

export interface IArchiveFileStorage {
    getAllFiles(): Promise<unknown>;
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

const getGoogleProjectDetails = () => {
    const credentials = process.env.GOOGLE_CREDENTIALS,
        project = process.env.GOOGLE_PROJECT_ID,
        archiveBucket = process.env.GOOGLE_ARCHIVE_BUCKET;

    if (!credentials) {
        throw new Error("Cannot access storage, credentials not provided");
    }

    if (!project) {
        throw new Error("Cannot find project name, unable to access cloud");
    }

    if (!archiveBucket) {
        throw new Error("Cannot find archive bucket, unable to access files");
    }

    return {
        credentials,
        project,
        archiveBucket,
    };
};

export class ArchiveFileStorage implements IArchiveFileStorage {
    private storage: Storage;
    private readonly path: string;
    private readonly project: string;
    private readonly bucket: string;

    constructor(path: string) {
        const { credentials, project, archiveBucket } =
            getGoogleProjectDetails();
        const jsonConfig = JSON.parse(
            Buffer.from(credentials, "base64").toString()
        );
        this.path = path;
        this.project = project;
        this.bucket = archiveBucket;
        this.storage = new Storage({
            projectId: project,
            credentials: jsonConfig,
        });
    }

    public async getAllFiles() {
        const [files] = await this.storage
            .bucket(this.bucket)
            .getFiles({ prefix: this.path });

        return files
            .map((f) => {
                return f.name;
            })
            .filter((n) => n != `${this.path}/`);
    }

    public async getFileLink(file: string) {
        const defaultReadOptions: GetSignedUrlConfig = {
            version: "v4",
            action: "read",
            expires: Date.now() + 60 * 60 * 1000, // 60 minutes
        };

        const [url] = await this.storage
            .bucket(this.bucket)
            .file(file)
            .getSignedUrl(defaultReadOptions);

        return url;
    }

    public async getMetaData(file: string) {
        const f = this.storage.bucket(this.bucket).file(file);

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
