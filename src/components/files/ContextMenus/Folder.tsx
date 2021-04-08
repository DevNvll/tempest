import { ContextMenu } from 'react-contextmenu'
import {
  MdCreateNewFolder,
  MdDelete,
  MdEdit,
  MdViewAgenda
} from 'react-icons/md'
import MenuItem from '@components/UI/MenuItem'

export default function FolderContextMenu({ handleContextClick }) {
  return (
    <>
      <ContextMenu
        id="folder-context-menu"
        className="z-20 w-56 overflow-hidden bg-gray-500 rounded shadow-lg"
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
