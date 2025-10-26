import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator'

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  role: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  customPermissions?: string[]
}

