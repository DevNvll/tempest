import ModalMove from '@components/files/Modal/Move'
import ModalRename from '@components/files/Modal/Rename'
import ModalCreateFolder from '@components/files/Modal/CreateFolder'

export enum ModalTypes {
  Rename,
  MoveItem,
  CreateFolder
}

const modalTypes: { [key in ModalTypes]: React.ComponentType } = {
  [ModalTypes.Rename]: ModalRename,
  [ModalTypes.MoveItem]: ModalMove,
  [ModalTypes.CreateFolder]: ModalCreateFolder
}

export { modalTypes }
