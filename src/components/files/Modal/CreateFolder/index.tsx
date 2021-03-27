import { ModalProps } from '@typings/modal'

export interface CreateFolderModalProps {
  parentId: string
  onCreate: (params: { parentId: string; name: string }) => void
}

const ModalCreateFolder: React.FC<ModalProps<CreateFolderModalProps>> = ({
  parentId,
  onCreate
}) => {
  return <div>Create Folder on {parentId} </div>
}

export default ModalCreateFolder
