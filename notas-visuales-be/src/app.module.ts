import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller.js';
import { NotasModule } from './notas/notas.module.js';

@Module({
  imports: [NotasModule],
  controllers: [HealthController],
})
export class AppModule { }
