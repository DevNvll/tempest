import Progress from '@components/UI/Progress'
import { useFiles } from '@store/files'
import { useStorage } from '@store/usage'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
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

const Wrapper = ({ children, href }) => {
  return href ? <Link href={href}>{children}</Link> : <>{children}</>
}

function MenuItem({ label, href = '', variant = 'default', Icon }) {
  const router = useRouter()

  function isRoute(route: string) {
    return router.pathname === route
  }

  const variants = {
    danger: {
      active: 'hover:bg-primary-500 hover:bg-opacity-10 text-danger-500',
      inactive: 'hover:bg-primary-500 hover:bg-opacity-10 hover:text-danger-500'
    },
    default: {
      active: 'hover:bg-primary-500 hover:bg-opacity-10 text-primary-300',
      inactive:
        'hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-300'
    },
    disabled: {
      active: 'hover:bg-primary-500 hover:bg-opacity-10 text-primary-300 ',
      inactive: 'opacity-50 cursor-default'
    }
  }

  return (
    <Wrapper href={href}>
      <a
        className={clsx(
          'flex flex-row space-x-2 px-6 py-3 items-center text-sm font-semibold cursor-pointer transition-all ease-in-out duration-150',
          {
            [variants[variant].active]: isRoute(href),
            [variants[variant].inactive]: !isRoute(href)
          }
        )}
      >
        <Icon />
        <span>{label}</span>
      </a>
    </Wrapper>
  )
}

export default function Sidebar() {
  const { usage } = useStorage()

  return (
    <>
      <div className="flex-grow flex flex-col">
        <span className="text-primary-300 font-bold text-xs px-6 pb-2">
          Base
        </span>
        <ul className="flex flex-col pb-4">
          <MenuItem label="My Files" href="/files" Icon={HiOutlineHome} />
          <MenuItem
            label="Recent Uploads"
            variant="disabled"
            Icon={HiOutlineCloudUpload}
          />
          <MenuItem
            label="Trash"
            href="/files/trash"
            variant="danger"
            Icon={HiOutlineTrash}
          />
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
