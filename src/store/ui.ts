import { ModalTypes } from '@constants/modal'
import create from 'zustand'
import { immer } from './middlewares'

import { ModalType } from '@typings/ui'
import { OpenModalParams } from '@typings/modal'

interface State {
  currentModals: Array<{ type: ModalType; props: any }>
  openModal: (params: OpenModalParams) => void
  closeModal: (modalType: ModalType) => void
}

// @ts-ignore
const useUI = create<State>(
  immer((set) => ({
    currentModals: [],
    openModal: ({ modalType, props }) =>
      set(
        (state) =>
          void state.currentModals.push({ type: ModalTypes[modalType], props })
      ),
    closeModal: (modalType: ModalType) =>
      set(
        (state) =>
          void (state.currentModals = state.currentModals.filter(
            (modal) => modal.type !== modalType
          ))
      )
  }))
)

export { useUI }
