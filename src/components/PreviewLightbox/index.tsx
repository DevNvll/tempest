import Button from '@components/UI/Button'
import { usePreview } from '@store/preview'
import { useRouter } from 'next/router'
import { memo, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  HiOutlineDocument,
  HiOutlineEyeOff,
  HiOutlineFolder,
  HiOutlinePhotograph,
  HiX
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

export default function PreviewLightbox() {
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

  useHotkeys(
    'esc',
    () => {
      preview.closeLightbox()
    },
    []
  )

  return preview.item && preview.lightbox && preview.loaded ? (
    <div className="fixed h-screen w-full top-0 left-0 z-[100]">
      <div className="h-full w-full flex flex-col bg-gray-900">
        <div className="bg-gray-900 min-h-[70px] w-full px-4 py-2 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-4">
            <button
              onClick={() => {
                preview.closeLightbox()
              }}
              className="focus:outline-none text-xl font-bold hover:text-gray-100 text-gray-200 transition-colors ease-in-out duration-150 flex items-center"
            >
              <HiX />
            </button>
            <p className="font-bold">{preview.item?.name}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center h-[calc(100vh-70px)]">
          <div className="flex flex-col items-center justify-center h-full">
            {preview.item?.mimeType === 'image' && (
              <img
                src={preview.item?.signedUrl}
                className="max-w-full max-h-full shadow-lg"
              />
            )}

            {preview.item?.mimeType === 'video' && (
              <video controls className="max-w-full max-h-full shadow-lg">
                <source src={preview.item?.signedUrl} />
              </video>
            )}

            {preview.item?.mimeType === 'audio' && (
              <audio controls className="max-w-full max-h-full shadow-lg">
                <source src={preview.item?.signedUrl} />
              </audio>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null
}
