import { ModalProps } from '@typings/modal'
import { ItemType } from 'aws-sdk/clients/mediastoredata'

export interface MoveItemModalProps {
  id: string
  newParentId: string
  type: ItemType
  onMove: (params: { id: string; newParentId: string; type: ItemType }) => void
}

const ModalMove: React.FC<ModalProps<MoveItemModalProps>> = ({
  id,
  type,
  newParentId
}) => {
  return (
    <div>
      Move {type} {id} to {newParentId}
    </div>
  )
}

export default ModalMove
