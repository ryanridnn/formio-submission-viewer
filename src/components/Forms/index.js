import { Formio } from '@formio/react'
import customModule from './custom/CustomModule'

Formio.use(customModule)

export { default as FormBuilder } from './FormBuilder'
export { default as FormRenderer } from './FormRenderer'