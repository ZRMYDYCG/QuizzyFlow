import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNumber,
} from 'class-validator'
import { Type } from 'class-transformer'

class PositionDto {
  @IsNumber()
  x: number

  @IsNumber()
  y: number
}

class FlowNodeDto {
  @IsString()
  id: string

  @IsString()
  type: string

  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto

  @IsOptional()
  data?: Record<string, any>

  @IsOptional()
  @IsNumber()
  width?: number

  @IsOptional()
  @IsNumber()
  height?: number
}

class FlowEdgeDto {
  @IsString()
  id: string

  @IsString()
  source: string

  @IsString()
  target: string

  @IsOptional()
  @IsString()
  sourceHandle?: string

  @IsOptional()
  @IsString()
  targetHandle?: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsBoolean()
  animated?: boolean

  @IsOptional()
  @IsString()
  label?: string

  @IsOptional()
  data?: Record<string, any>
}

class ViewportDto {
  @IsNumber()
  x: number

  @IsNumber()
  y: number

  @IsNumber()
  zoom: number
}

export class CreateFlowDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlowNodeDto)
  @IsOptional()
  nodes?: FlowNodeDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlowEdgeDto)
  @IsOptional()
  edges?: FlowEdgeDto[]

  @ValidateNested()
  @Type(() => ViewportDto)
  @IsOptional()
  viewport?: ViewportDto
}

