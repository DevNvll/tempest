import { ModalTypes } from '@constants/modal'
import create, { State } from 'zustand'
import { immer } from './middlewares'

import { OpenModalParams, ModalType } from '@typings/modal'

interface UIStore extends State {
  currentModals: Array<{ type: ModalTypes; props: any }>
  openModal: (params: OpenModalParams) => void
  closeModal: (modalType: ModalType) => void
}

const useUI = create<UIStore>(
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
            (modal) => modal.type === ModalTypes[modalType]
          ))
      )
  }))
)

export { useUI }
