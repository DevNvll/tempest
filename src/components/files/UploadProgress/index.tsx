import { useUpload } from '@store/upload'
import Progress from '@components/UI/Progress'
import clsx from 'clsx'

export function UploadProgress() {
  const upload = useUpload()
  return (
    <div
      className={clsx(
        'flex flex-col items-center transition-all duration-200 ease-in-out',
        {
          'h-32 opacity-100': upload.uploading,
          'h-0 opacity-0': !upload.uploading
        }
      )}
    >
      <h1>
        Upload in progress ({upload.items - upload.queue.length}/{upload.items})
      </h1>
      <Progress progress={upload.progress} />
    </div>
  )
}
