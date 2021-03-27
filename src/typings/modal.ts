import { CreateFolderModalProps } from '@components/files/Modal/CreateFolder'
import { MoveItemModalProps } from '@components/files/Modal/Move'
import { RenameItemModalProps } from '@components/files/Modal/Rename'
import { ModalTypes } from '@constants/modal'

export type ModalType = keyof typeof ModalTypes

export type IntrinsicModalProps = { close: () => void }

export type ModalProps<T> = T & IntrinsicModalProps

export type OpenModalParams =
  | { modalType: 'Rename'; props: RenameItemModalProps }
  | { modalType: 'MoveItem'; props: MoveItemModalProps }
  | {
      modalType: 'CreateFolder'
      props: CreateFolderModalProps
    }
