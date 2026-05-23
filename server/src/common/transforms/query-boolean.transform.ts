import { Transform } from 'class-transformer'

/** 解析 query 中的布尔值（避免 @Type(() => Boolean) 把 "false" 转成 true） */
export function QueryBoolean(): PropertyDecorator {
  return Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined
    }
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return true
    }
    if (value === false || value === 'false' || value === 0 || value === '0') {
      return false
    }
    return Boolean(value)
  })
}
