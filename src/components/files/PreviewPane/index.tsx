import Button from '@components/UI/Button'
import { usePreview } from '@store/preview'
import { useRouter } from 'next/router'
import { memo, useEffect } from 'react'
import {
  HiOutlineDocument,
  HiOutlineEyeOff,
  HiOutlineFolder,
  HiOutlinePhotograph,
  HiOutlineStar,
  HiStar
} from 'react-icons/hi'

const FilePreview = memo(({ preview }: any) => {
  function renderIcon() {
    switch (preview.item?.mimeType) {
      case 'image': {
        return <HiOutlinePhotograph className="text-2xl" />
      }
      default: {
        return <HiOutlineDocument className="text-2xl" />
      }
    }
  }

  return (
    <>
      {preview.item?.mimeType === 'image' && (
        <div>
          <img
            src={'/api/dam/thumbnails/' + preview.item?.id}
            className="w-full rounded-xl"
          />
        </div>
      )}
      <div className="flex flex-row space-x-2 w-full">
        <div>{renderIcon()}</div>
        <div>
          <p className="font-semibold break-all flex-wrap">
            {preview.item?.name}
          </p>
          <p className="text-primary-200 text-sm font-thin">
            .{preview.item?.mimeSubtype}
          </p>
        </div>
      </div>
      <div>
        <p className="text-primary-300">Size</p>
        <p>{preview.item?.readableSize}</p>
      </div>
      <div>
        <p className="text-primary-300">Created at</p>
        <p>{new Date(preview.item?.createdAt).toDateString()}</p>
      </div>
      <div>
        <p className="text-primary-300">Where</p>
        <p>{preview.item?.parent?.name || 'Files'}</p>
      </div>
      <div className="flex flex-row space-x-4 self-end">
        <a href={preview.item?.signedUrl} target="_blank">
          <Button>Download</Button>
        </a>
      </div>
    </>
  )
})

const FolderPreview = ({ preview }: any) => {
  return (
    <>
      <div className="flex flex-row space-x-2 w-full">
        <div>
          <HiOutlineFolder className="text-2xl" />
        </div>
        <div>
          <p className="font-semibold break-all flex-wrap">
            {preview.item?.name}
          </p>
        </div>
      </div>
      <div>
        <p className="text-primary-300">Created at</p>
        <p>{new Date(preview.item?.createdAt).toDateString()}</p>
      </div>
      <div>
        <p className="text-primary-300">Where</p>
        <p>{preview.item?.parent?.name || 'Files'}</p>
      </div>
    </>
  )
}

export default function PreviewPane() {
  const preview = usePreview()
  const router = useRouter()

  useEffect(() => {
    router.events?.on('routeChangeStart', () => {
      preview.clear()
    })
    return () => {
      router.events?.off('routeChangeStart', () => {})
    }
  }, [])

  return preview.enabled ? (
    <div className="flex flex-col h-full w-[280px] px-4 space-y-4 preview-pane">
      {preview.item ? (
        <>
          {preview.selectedType === 'file' ? (
            <FilePreview preview={preview} />
          ) : (
            <FolderPreview preview={preview} />
          )}
        </>
      ) : (
        <div className="flex flex-col h-full justify-center items-center space-y-4">
          <HiOutlineEyeOff className="text-5xl opacity-50" />
          <p className="font-thin text-sm">Nothing to show</p>
        </div>
      )}
    </div>
  ) : null
}
