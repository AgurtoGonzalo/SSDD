var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { randomUUID } from 'node:crypto';
import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { JsonDb } from '../database/json-db.js';
let NotasService = class NotasService {
    db;
    constructor(db) {
        this.db = db;
    }
    create(dto) {
        return this.db.update((data) => {
            const repetido = data.notas.some((nota) => nota.title === dto.title);
            if (repetido) {
                throw new ConflictException('Ya existe una nota con ese titulo');
            }
            const nota = {
                id: randomUUID(),
                title: dto.title,
                text: dto.text,
                color: dto.color,
                validUntil: dto.validUntil,
                notified: false,
            };
            data.notas.push(nota);
            return nota;
        });
    }
    async findAll() {
        const data = await this.db.read();
        return [...data.notas].sort((a, b) => b.validUntil - a.validUntil);
    }
    async findOne(id) {
        const data = await this.db.read();
        const nota = data.notas.find((item) => item.id === id);
        if (!nota)
            throw new NotFoundException('Nota no encontrada');
        return nota;
    }
    update(id, dto) {
        return this.db.update((data) => {
            const nota = data.notas.find((item) => item.id === id);
            if (!nota)
                throw new NotFoundException('Nota no encontrada');
            const title = dto.title ?? nota.title;
            const text = dto.text ?? nota.text;
            const color = dto.color ?? nota.color;
            const validUntil = dto.validUntil ?? nota.validUntil;
            const repetido = data.notas.some((item) => item.id !== id && (item.title === title));
            if (repetido) {
                throw new ConflictException('Ya existe una nota con ese titulo');
            }
            if (dto.notified !== undefined)
                nota.notified = dto.notified;
            if (dto.title !== undefined)
                nota.title = title;
            if (dto.text !== undefined)
                nota.text = text;
            if (dto.color !== undefined)
                nota.color = color;
            if (dto.validUntil !== undefined)
                nota.validUntil = validUntil;
            return nota;
        });
    }
    remove(id) {
        return this.db.update((data) => {
            const index = data.notas.findIndex((item) => item.id === id);
            if (index === -1)
                throw new NotFoundException('Nota no encontrada');
            data.notas.splice(index, 1);
            return { mensaje: 'Nota eliminada', id };
        });
    }
};
NotasService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JsonDb])
], NotasService);
export { NotasService };
//# sourceMappingURL=notas.service.js.map