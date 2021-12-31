export interface IArchiveService {
    getArchives(): Promise<object[]>
}

export class ArchiveService implements IArchiveService {
    public async getArchives() {
        return []
    }
}
