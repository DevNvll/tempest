import Progress from '@components/UI/Progress'
import { useFiles } from '@store/files'
import { useStorage } from '@store/usage'
import clsx from 'clsx'
import {
  HiChevronRight,
  HiOutlineCloudUpload,
  HiOutlineFolder,
  HiOutlineFolderAdd,
  HiOutlineHome,
  HiOutlineTrash,
  HiPlus
} from 'react-icons/hi'
import UploadButton from '../UploadButton'

export default function Sidebar() {
  const { usage } = useStorage()
  return (
    <>
      <div className="flex-grow flex flex-col">
        <span className="text-primary-300 font-bold text-xs px-6 pb-2">
          Base
        </span>
        <ul className="flex flex-col pb-4">
          <li
            className={clsx(
              'flex flex-row space-x-2 px-6 py-3 items-center text-sm font-semibold cursor-pointer transition-all ease-in-out duration-150',
              {
                'hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-300': false,
                'hover:bg-primary-500 hover:bg-opacity-10 text-primary-300': true
              }
            )}
          >
            <HiOutlineHome />
            <span>My Files</span>
          </li>
          <li
            className={clsx(
              'flex flex-row space-x-2 px-6 py-3 items-center text-sm font-semibold cursor-pointer transition-all ease-in-out duration-150',
              {
                'hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-300': true,
                'hover:bg-primary-500 hover:bg-opacity-10 text-primary-300': false
              }
            )}
          >
            <HiOutlineCloudUpload />
            <span>Recent Uploads</span>
          </li>
          <li
            className={clsx(
              'flex flex-row space-x-2 px-6 py-3 items-center text-sm font-semibold cursor-pointer transition-all ease-in-out duration-150',
              {
                'hover:bg-primary-500 hover:bg-opacity-10 hover:text-danger-500': true,
                'hover:bg-primary-500 hover:bg-opacity-10 text-primary-300': false
              }
            )}
          >
            <HiOutlineTrash />
            <span>Trash</span>
          </li>
        </ul>
        <span className="text-primary-300 font-bold text-xs px-6 pb-2">
          Navigation
        </span>
        <ul className="flex flex-col pb-4">
          <li
            className={clsx(
              'flex flex-row space-x-2 px-6 py-3 items-center text-sm font-semibold cursor-pointer transition-all ease-in-out duration-150',
              {
                'hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-300': true,
                'hover:bg-primary-500 hover:bg-opacity-10 text-primary-300': false
              }
            )}
          >
            <span>
              <HiChevronRight />
            </span>
            <HiOutlineFolder />
            <span>Files</span>
          </li>
          <li
            className={clsx(
              'flex flex-row space-x-2 px-6 py-3 items-center text-sm font-semibold cursor-pointer transition-all ease-in-out duration-150',
              {
                'hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-300': true,
                'hover:bg-primary-500 hover:bg-opacity-10 text-primary-300': false
              }
            )}
          >
            <span>
              <HiChevronRight className="text-transparent" />
            </span>
            <HiOutlineFolderAdd />
            <span>New Folder</span>
          </li>
        </ul>
      </div>
      <div className="px-4 self-end w-full">
        <div className="mb-4 w-full">
          <div className="flex flex-col bg-gray-500 rounded p-4">
            <div>
              <p>Storage</p>
            </div>
            <div>
              <p className="text-xs">
                {usage?.sizeReadable}{' '}
                <span className="font-thin text-xs">
                  of {usage?.maxReadable}
                </span>
              </p>
              <Progress progress={(usage?.size / usage?.max) * 100} />
            </div>
          </div>
        </div>
        <UploadButton id="sidebar">
          <div className="px-4 py-2 w-full font-bold bg-primary-500 text-center cursor-pointer flex flex-row items-center justify-center">
            <HiPlus />
            <span>Upload File</span>
          </div>
        </UploadButton>
      </div>
    </>
  )
}
