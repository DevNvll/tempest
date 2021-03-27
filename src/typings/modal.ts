import { ModalTypes } from '@constants/modal'
import { ItemType } from './files'

export type ModalType = keyof typeof ModalTypes

export type OpenModalParams =
  | { modalType: 'Rename'; props: { id: string; type: ItemType; name: string } }
  | { modalType: 'MoveItem'; props: { id: string; type: ItemType } }
  | {
      modalType: 'CreateFolder'
      props: { id: string; type: ItemType; parentId: string }
    }
