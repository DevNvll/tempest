import { ContextMenu } from 'react-contextmenu'
import { MdCreateNewFolder } from 'react-icons/md'
import MenuItem from '@components/UI/MenuItem'

export default function BackgroundContextMenu({ handleContextClick }) {
  return (
    <>
      <ContextMenu
        id="bg"
        className="bg-gray-500 rounded overflow-hidden shadow-lg w-56"
      >
        <MenuItem
          onClick={handleContextClick}
          label="Create Folder"
          Icon={MdCreateNewFolder}
        />
      </ContextMenu>
    </>
  )
}
