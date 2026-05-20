const INTERACTIVE_TYPES = [
  'question-input',
  'question-textarea',
  'question-radio',
  'question-checkbox',
  'question-select',
  'question-rate',
  'question-date',
  'question-cascader',
  'question-autocomplete',
  'question-tree-select',
  'question-time-picker',
  'question-number-input',
  'question-password-input',
  'question-email-input',
  'question-phone-input',
  'question-url-input',
  'question-range-picker',
  'question-time-range-picker',
  'question-mentions',
  'question-week-picker',
  'question-month-picker',
  'question-year-picker',
  'question-mention-textarea',
] as const

export function isInteractiveComponent(type: string): boolean {
  return (INTERACTIVE_TYPES as readonly string[]).includes(type)
}
