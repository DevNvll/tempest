import { ModalProps } from '@typings/modal'
import { ItemType } from 'aws-sdk/clients/mediastoredata'

export interface RenameItemModalProps {
  id: string
  type: ItemType
  onRename: (params: { id: string; newName: string; type: ItemType }) => void
}

const ModalRename: React.FC<ModalProps<RenameItemModalProps>> = ({
  id,
  type
}) => {
  return (
    <div>
      Rename {type} {id}
    </div>
  )
}

export default ModalRename
