/**
 * Component Library Schema（从 shared/material-library 导出，兼容旧引用）
 */

import {
  MATERIAL_LIBRARY,
  getMaterialLibraryJSON,
  type MaterialDefinition,
} from '../shared/material-library'
import type { ComponentDefinition } from '../types'

export const COMPONENT_LIBRARY: ComponentDefinition[] = MATERIAL_LIBRARY.map(
  (m) => ({
    type: m.type,
    label: m.label,
    category: m.category === 'datetime' ? 'advanced' : m.category,
    description: m.description,
    defaultProps: m.defaultProps,
    requiredProps: m.requiredProps,
    examples: [],
  }),
) as ComponentDefinition[]

export type { MaterialDefinition }

export const getComponentDefinition = (type: string) =>
  COMPONENT_LIBRARY.find((comp) => comp.type === type)

export const getAllComponentTypes = () => COMPONENT_LIBRARY.map((comp) => comp.type)

export const getComponentsByCategory = (
  category: ComponentDefinition['category'],
) => COMPONENT_LIBRARY.filter((comp) => comp.category === category)

export { getMaterialLibraryJSON as getComponentLibraryJSON }
