import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator'

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  displayName: string

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[]

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsNumber()
  @IsOptional()
  priority?: number
}

