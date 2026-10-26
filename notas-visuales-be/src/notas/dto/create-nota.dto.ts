import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNotaDto {
    @ApiProperty({ example: 'Jugar tremendo Minecraft' })
    @IsString()
    @IsNotEmpty({ message: 'El titulo es obligatorio' })
    @MaxLength(80)
    title: string;

    @ApiProperty({ example: 'Terminar granja en el nether' })
    @IsString()
    @IsNotEmpty({ message: 'El texto es obligatorio' })
    @MaxLength(80)
    text: string;

    @ApiProperty({ example: 'blue' })
    @IsString()
    @IsNotEmpty({ message: 'El color es obligatorio' })
    @MaxLength(80)
    color: string;

    @ApiProperty({ example: 1787145600 })
    @IsNumber()
    @IsNotEmpty({ message: 'El tiempo de expiración es obligatorio' })
    validUntil: number;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    notified?: boolean;
}
