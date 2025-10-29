import { PartialType } from '@nestjs/mapped-types'
import { CreateFlowDto } from './create-flow.dto'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateFlowDto extends PartialType(CreateFlowDto) {
  @IsBoolean()
  @IsOptional()
  isStar?: boolean

  @IsString()
  @IsOptional()
  thumbnail?: string
}

