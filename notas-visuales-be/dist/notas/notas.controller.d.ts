import { NotasService } from './notas.service.js';
import { CreateNotaDto } from './dto/create-nota.dto.js';
import { UpdateNotaDto } from './dto/update-nota.dto.js';
export declare class NotasController {
    private readonly notasService;
    constructor(notasService: NotasService);
    create(dto: CreateNotaDto): Promise<import("./entities/nota.entity.js").Nota>;
    findAll(): Promise<import("./entities/nota.entity.js").Nota[]>;
    findOne(id: string): Promise<import("./entities/nota.entity.js").Nota>;
    update(id: string, dto: UpdateNotaDto): Promise<import("./entities/nota.entity.js").Nota>;
    remove(id: string): Promise<{
        mensaje: string;
        id: string;
    }>;
}
