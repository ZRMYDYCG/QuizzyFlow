import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsObject } from 'class-validator'

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsString()
  @IsNotEmpty()
  category: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsObject()
  @IsNotEmpty()
  templateData: {
    title: string
    desc: string
    type: string
    componentList: any[]
    pageInfo: Record<string, any>
  }

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean
}

