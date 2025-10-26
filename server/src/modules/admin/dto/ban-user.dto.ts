import { IsString, IsNotEmpty, IsBoolean } from 'class-validator'

export class BanUserDto {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean

  @IsString()
  @IsNotEmpty()
  reason: string
}

