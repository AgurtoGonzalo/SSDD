import { JsonDb } from '../database/json-db.js';
import { CreateNotaDto } from './dto/create-nota.dto.js';
import { UpdateNotaDto } from './dto/update-nota.dto.js';
import { Nota } from './entities/nota.entity.js';
export declare class NotasService {
    private readonly db;
    constructor(db: JsonDb);
    create(dto: CreateNotaDto): Promise<Nota>;
    findAll(): Promise<Nota[]>;
    findOne(id: string): Promise<Nota>;
    update(id: string, dto: UpdateNotaDto): Promise<Nota>;
    remove(id: string): Promise<{
        mensaje: string;
        id: string;
    }>;
}
