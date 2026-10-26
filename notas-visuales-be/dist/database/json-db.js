var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
function emptyDatabase() {
    return { notas: [] };
}
let JsonDb = class JsonDb {
    queue = Promise.resolve();
    filePath() {
        return process.env.DATA_FILE ?? join(process.cwd(), 'data', 'db.json');
    }
    async read() {
        try {
            const raw = await readFile(this.filePath(), 'utf8');
            return JSON.parse(raw);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return emptyDatabase();
            }
            throw error;
        }
    }
    update(change) {
        const run = this.queue.then(async () => {
            const db = await this.read();
            const result = change(db);
            await this.write(db);
            return result;
        });
        this.queue = run.then(() => undefined, () => undefined);
        return run;
    }
    async write(db) {
        const path = this.filePath();
        await mkdir(dirname(path), { recursive: true });
        const temporary = `${path}.${randomUUID()}.tmp`;
        await writeFile(temporary, `${JSON.stringify(db, null, 2)}\n`);
        await rename(temporary, path);
    }
};
JsonDb = __decorate([
    Injectable()
], JsonDb);
export { JsonDb };
//# sourceMappingURL=json-db.js.map