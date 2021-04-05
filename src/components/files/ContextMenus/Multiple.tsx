import { ContextMenu } from 'react-contextmenu'
import { MdDelete, MdEdit, MdViewAgenda } from 'react-icons/md'
import MenuItem from '@components/UI/MenuItem'

export default function MultipleItemsContextMenu({ handleContextClick }) {
  return (
    <>
      <ContextMenu
        id="multiple-context-menu"
        className="bg-gray-500 rounded overflow-hidden shadow-lg w-56 z-20"
      >
        <MenuItem
          onClick={handleContextClick}
          label="Move"
          Icon={MdEdit}
          data={{ action: 'MOVE' }}
        />
        <MenuItem
          onClick={handleContextClick}
          label="Delete"
          Icon={MdDelete}
          data={{ action: 'DELETE' }}
          danger
        />
      </ContextMenu>
    </>
  )
}
