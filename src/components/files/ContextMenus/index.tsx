import FolderContextMenu from './Folder'
import FileContextMenu from './File'
import BackgroundContextMenu from './Background'

export default function ContextMenus({ handleContextClick }) {
  return (
    <>
      <FolderContextMenu handleContextClick={handleContextClick} />
      <FileContextMenu handleContextClick={handleContextClick} />
      <BackgroundContextMenu handleContextClick={handleContextClick} />
    </>
  )
}
