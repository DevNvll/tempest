import { useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { MdDelete, MdEdit, MdFolder, MdViewAgenda } from 'react-icons/md'
import cs from 'clsx'

import MenuItem from '@components/UI/MenuItem'
import { HiOutlineCheck } from 'react-icons/hi'
import { useFiles } from '@store/files'
import { usePreview } from '@store/preview'

const Folder = ({ id, name, numberOfItems = 0, onClick, selected = false }) => {
  const { state } = useFiles()
  const preview = usePreview()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    active
  } = useDraggable({
    id
  })

  const { setNodeRef: setDroppableNodeRef, isOver, over } = useDroppable({
    id,
    disabled:
      state.selectedItems.length > 1 &&
      state.selectedItems.find((i) => i === active)
        ? Boolean(state.selectedItems.find((i) => i === id))
        : active === id
  })

  const router = useRouter()
  const contextMenuId = 'context-menu-folder' + name
  function handleClick(e, data) {
    switch (data.action) {
      case 'VIEW': {
        router.push('/folder/' + data.id)
        return
      }
    }
  }

  return (
    <>
      <div
        className="select-none"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <div
          className={cs('rounded border-2 border-dashed directory-item', {
            'border-primary-500': isOver,
            ' border-transparent': !isOver
          })}
          ref={setDroppableNodeRef}
        >
          <div>
            <ContextMenuTrigger
              id={contextMenuId}
              collect={() => {
                return { id }
              }}
              holdToDisplay={999999}
              attributes={{
                className: cs(
                  ' p-4 w-40 hover:bg-gray-100 hover:bg-opacity-10 rounded-lg cursor-pointer flex flex-col items-center justify-center',
                  {
                    'bg-gray-100 bg-opacity-10': selected
                  }
                ),
                onDoubleClick: () => {
                  router.push('/files/folder/' + id)
                },
                onClick: (e) => {
                  if (!isDragging) {
                    preview.setPreview('folder', id)
                    onClick(id, e.shiftKey)
                  }
                }
              }}
            >
              <div className=" w-28 h-28 flex items-center justify-center py-4">
                <MdFolder className="text-primary-500 text-8xl" />
              </div>
              <div className="text-center w-full mt-2  space-y-2">
                <p className="font-bold break-words">{name}</p>
                <p className="text-xs font-light">
                  {numberOfItems > 0 ? numberOfItems + ' items' : 'Empty'}{' '}
                </p>
              </div>
            </ContextMenuTrigger>
            <ContextMenu
              id={contextMenuId}
              className="bg-gray-500 rounded overflow-hidden shadow-lg w-56"
            >
              <MenuItem
                onClick={handleClick}
                label="View"
                Icon={MdViewAgenda}
                data={{ action: 'VIEW' }}
              />
              <MenuItem
                onClick={handleClick}
                label="Rename"
                Icon={MdEdit}
                data={{ action: 'RENAME' }}
              />
              <MenuItem
                onClick={handleClick}
                label="Delete"
                Icon={MdDelete}
                data={{ action: 'DELETE' }}
                danger
              />
            </ContextMenu>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Folder)
