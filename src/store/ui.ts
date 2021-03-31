import { ModalTypes } from '@constants/modal'
import create, { State } from 'zustand'
import { immer } from './middlewares'

import { OpenModalParams, ModalType } from '@typings/modal'
import { ToastTypes } from '@typings/ui'

interface UIStore extends State {
  messages: Array<{ message: string; type: ToastTypes }>
  currentModals: Array<{ type: ModalTypes; props: any }>
  openModal: (params: OpenModalParams) => void
  closeModal: (modalType: ModalTypes) => void
  toast: (message: string, type?: ToastTypes) => void
  clearToasts: () => void
}

const useUI = create<UIStore>(
  immer((set) => ({
    messages: [],
    currentModals: [],
    openModal: ({ modalType, props }) =>
      set((state) => {
        state.currentModals.push({ type: modalType, props })
      }),
    closeModal: (modalType) =>
      set((state) => {
        state.currentModals = state.currentModals.filter(
          (modal) => modal.type !== modalType
        )
      }),
    toast: (message, type = 'success') => {
      set((state) => {
        state.messages.push({ message, type })
      })
    },
    clearToasts: () => {
      set((state) => {
        state.messages = []
      })
    }
  }))
)

export { useUI }
