import { ModalTypes } from '@constants/modal'

export type ModalType = keyof typeof ModalTypes

export type ToastTypes = 'success' | 'error' | 'warning' | 'info'
