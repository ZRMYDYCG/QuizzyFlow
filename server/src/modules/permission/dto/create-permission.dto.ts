import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator'

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  module: string

  @IsString()
  @IsNotEmpty()
  action: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dependencies?: string[]
}

