import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsIn,
  ValidateNested,
  Min,
  Max,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 编辑器设置 DTO
 */
export class EditorSettingsDto {
  @ApiProperty({
    description: '是否自动保存',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  autoSave?: boolean

  @ApiProperty({
    description: '自动保存间隔（秒）',
    example: 30,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(10, { message: '自动保存间隔不能少于10秒' })
  @Max(300, { message: '自动保存间隔不能超过300秒' })
  autoSaveInterval?: number

  @ApiProperty({
    description: '默认缩放比例',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0.1, { message: '缩放比例不能小于0.1' })
  @Max(3, { message: '缩放比例不能大于3' })
  defaultScale?: number

  @ApiProperty({
    description: '是否显示网格',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showGrid?: boolean

  @ApiProperty({
    description: '是否显示标尺',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showRulers?: boolean
}

/**
 * 更新用户偏好设置 DTO
 */
export class UpdatePreferencesDto {
  @ApiProperty({
    description: '主题',
    example: 'light',
    enum: ['light', 'dark'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['light', 'dark'], { message: '主题只能是 light 或 dark' })
  theme?: string

  @ApiProperty({
    description: '语言',
    example: 'zh-CN',
    enum: ['zh-CN', 'en-US'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['zh-CN', 'en-US'], { message: '语言只能是 zh-CN 或 en-US' })
  language?: string

  @ApiProperty({
    description: '编辑器设置',
    type: EditorSettingsDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => EditorSettingsDto)
  @IsOptional()
  editorSettings?: EditorSettingsDto

  @ApiProperty({
    description: '列表展示方式',
    example: 'card',
    enum: ['card', 'table'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['card', 'table'], { message: '列表展示方式只能是 card 或 table' })
  listView?: string
}

