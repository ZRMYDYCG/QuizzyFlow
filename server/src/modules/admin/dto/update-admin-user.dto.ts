import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
