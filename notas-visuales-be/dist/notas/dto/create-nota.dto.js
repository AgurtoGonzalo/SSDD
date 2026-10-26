var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateNotaDto {
    title;
    text;
    color;
    validUntil;
    notified;
}
__decorate([
    ApiProperty({ example: 'Jugar tremendo Minecraft' }),
    IsString(),
    IsNotEmpty({ message: 'El titulo es obligatorio' }),
    MaxLength(80),
    __metadata("design:type", String)
], CreateNotaDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ example: 'Terminar granja en el nether' }),
    IsString(),
    IsNotEmpty({ message: 'El texto es obligatorio' }),
    MaxLength(80),
    __metadata("design:type", String)
], CreateNotaDto.prototype, "text", void 0);
__decorate([
    ApiProperty({ example: 'blue' }),
    IsString(),
    IsNotEmpty({ message: 'El color es obligatorio' }),
    MaxLength(80),
    __metadata("design:type", String)
], CreateNotaDto.prototype, "color", void 0);
__decorate([
    ApiProperty({ example: 1787145600 }),
    IsNumber(),
    IsNotEmpty({ message: 'El tiempo de expiración es obligatorio' }),
    __metadata("design:type", Number)
], CreateNotaDto.prototype, "validUntil", void 0);
__decorate([
    ApiProperty({ example: false, required: false }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateNotaDto.prototype, "notified", void 0);
//# sourceMappingURL=create-nota.dto.js.map