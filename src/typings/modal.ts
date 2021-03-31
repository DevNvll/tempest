import { CreateFolderModalProps } from '@components/files/Modal/CreateFolder'
import { MoveItemModalProps } from '@components/files/Modal/Move'
import { RenameItemModalProps } from '@components/files/Modal/Rename'
import { ModalTypes } from '@constants/modal'

export type ModalType = typeof ModalTypes

export type IntrinsicModalProps = { close: () => void }

export type ModalProps<T> = T & IntrinsicModalProps

export type OpenModalParams =
  | { modalType: ModalTypes.Rename; props: RenameItemModalProps }
  | { modalType: ModalTypes.MoveItem; props: MoveItemModalProps }
  | {
      modalType: ModalTypes.CreateFolder
      props: CreateFolderModalProps
    }
