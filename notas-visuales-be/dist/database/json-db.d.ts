export type NotaGuardada = {
    id: string;
    title: string;
    text: string;
    color: string;
    validUntil: number;
    notified: boolean;
};
export type DatabaseFile = {
    notas: NotaGuardada[];
};
export declare class JsonDb {
    private queue;
    filePath(): string;
    read(): Promise<DatabaseFile>;
    update<T>(change: (db: DatabaseFile) => T): Promise<T>;
    private write;
}
