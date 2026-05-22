import { Transform } from 'class-transformer'
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'

const TEXT_ACTIONS = [
  'continue',
  'polish',
  'translate',
  'rewrite',
  'simplify',
  'expand',
] as const

export type TextAIActionType = (typeof TEXT_ACTIONS)[number]

export const TRANSLATE_TARGET_LANGUAGES = [
  'zh',
  'en',
  'ja',
  'ko',
  'fr',
  'de',
  'es',
] as const

export type TranslateTargetLanguage = (typeof TRANSLATE_TARGET_LANGUAGES)[number]

export class ProcessTextDto {
  @IsIn(TEXT_ACTIONS)
  action: TextAIActionType

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  text: string

  @IsString()
  @IsOptional()
  context?: string

  /** 翻译目标语言（仅 action=translate 时有效） */
  @IsOptional()
  @IsIn(TRANSLATE_TARGET_LANGUAGES)
  targetLanguage?: TranslateTargetLanguage
}
