import { ContextMenu } from 'react-contextmenu'
import { MdDelete, MdEdit, MdViewAgenda } from 'react-icons/md'
import MenuItem from '@components/UI/MenuItem'

export default function FileContextMenu({ handleContextClick }) {
  return (
    <>
      <ContextMenu
        id="file-context-menu"
        className="bg-gray-500 rounded overflow-hidden shadow-lg w-56 z-20"
      >
        <MenuItem
          onClick={handleContextClick}
          label="View"
          Icon={MdViewAgenda}
          data={{ action: 'VIEW' }}
        />
        <MenuItem
          onClick={handleContextClick}
          label="Rename"
          Icon={MdEdit}
          data={{ action: 'RENAME' }}
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
