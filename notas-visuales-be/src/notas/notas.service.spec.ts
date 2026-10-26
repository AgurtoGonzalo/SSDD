import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonDb } from '../database/json-db.js';
import { NotasService } from './notas.service.js';



describe('NotasService', () => {
  let directory: string;
  let service: NotasService;
  let db: JsonDb;
  const previousDataFile = process.env.DATA_FILE;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'notas-test-'));
    process.env.DATA_FILE = join(directory, 'db.json');
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotasService, JsonDb],
    }).compile();
    service = module.get(NotasService);
    db = module.get(JsonDb);
  });

  afterEach(async () => {
    if (previousDataFile === undefined) delete process.env.DATA_FILE;
    else process.env.DATA_FILE = previousDataFile;
    await rm(directory, { recursive: true, force: true });
  });

  it('crea una nota', async () => {
    const tiempo = Date.now() + 60000;
    const nota = await service.create({
      title: 'titulo',
      text: 'texto',
      color: 'color',
      validUntil: tiempo,
    });

    expect(nota.id).toEqual(expect.any(String));
    expect(nota.title).toBe('titulo');
    expect(nota.text).toBe('texto');
    expect(nota.color).toBe('color');
    expect(nota.validUntil).toBe(tiempo);
    await expect(service.findAll()).resolves.toEqual([nota]);
  });

  it('rechaza una nota repetida', async () => {
    await service.create({
      title: 'titulo',
      text: 'texto',
      color: 'color',
      validUntil: Date.now() + 60000,
    });

    await expect(
      service.create({
        title: 'titulo',
        text: 'texto',
        color: 'color',
        validUntil: Date.now() + 60000,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('no encuentra una nota inexistente', async () => {
    await expect(service.findOne('uuid')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('elimina una nota', async () => {
    const nota = await service.create({
      title: 'titulo',
      text: 'texto',
      color: 'color',
      validUntil: Date.now() + 60000,
    });
    await service.remove(nota.id);
    await expect(service.findOne(nota.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
