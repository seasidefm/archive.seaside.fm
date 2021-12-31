export interface IArchiveFileStorage {
    getFile(): Promise<unknown>
}

export class ArchiveFileStorage implements IArchiveFileStorage {
    async getFile() {
        return
    }
}
