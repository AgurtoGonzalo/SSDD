import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JsonDb } from '../database/json-db.js';
import { CreateNotaDto } from './dto/create-nota.dto.js';
import { UpdateNotaDto } from './dto/update-nota.dto.js';
import { Nota } from './entities/nota.entity.js';

@Injectable()
export class NotasService {
  constructor(private readonly db: JsonDb) { }

  create(dto: CreateNotaDto): Promise<Nota> {
    return this.db.update((data) => {
      const repetido = data.notas.some(
        (nota) => nota.title === dto.title,
      );
      if (repetido) {
        throw new ConflictException(
          'Ya existe una nota con ese titulo',
        );
      }
      const nota: Nota = {
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

  async findAll(): Promise<Nota[]> {
    const data = await this.db.read();
    return [...data.notas].sort((a, b) => b.validUntil - a.validUntil);
  }


  async findOne(id: string): Promise<Nota> {
    const data = await this.db.read();
    const nota = data.notas.find((item) => item.id === id);
    if (!nota) throw new NotFoundException('Nota no encontrada');
    return nota;
  }

  update(id: string, dto: UpdateNotaDto): Promise<Nota> {
    return this.db.update((data) => {
      const nota = data.notas.find((item) => item.id === id);
      if (!nota) throw new NotFoundException('Nota no encontrada');

      const title = dto.title ?? nota.title;
      const text = dto.text ?? nota.text;
      const color = dto.color ?? nota.color;
      const validUntil = dto.validUntil ?? nota.validUntil;

      const repetido = data.notas.some(
        (item) =>
          item.id !== id && (item.title === title),
      );
      if (repetido) {
        throw new ConflictException(
          'Ya existe una nota con ese titulo',
        );
      }
      if (dto.notified !== undefined) nota.notified = dto.notified;
      if (dto.title !== undefined) nota.title = title;
      if (dto.text !== undefined) nota.text = text;
      if (dto.color !== undefined) nota.color = color;
      if (dto.validUntil !== undefined) nota.validUntil = validUntil;
      return nota;
    });
  }

  remove(id: string): Promise<{ mensaje: string; id: string }> {
    return this.db.update((data) => {
      const index = data.notas.findIndex((item) => item.id === id);
      if (index === -1) throw new NotFoundException('Nota no encontrada');
      data.notas.splice(index, 1);
      return { mensaje: 'Nota eliminada', id };
    });
  }
}
