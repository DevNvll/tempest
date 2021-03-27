import { useFiles } from '@store/files'
import { useUpload } from '@store/upload'
import { HiPlus } from 'react-icons/hi'

export default function UploadButton({ children, id = 'upload-button' }) {
  const upload = useUpload()
  const {
    state: { folderId },
    operations: { refetch }
  } = useFiles()

  return (
    <div className="w-full">
      <input
        name={'fileInput-' + id}
        type="file"
        className="hidden"
        multiple
        id={'fileInput-' + id}
        onChange={async (e) => {
          const filesToUpload = [...e.target.files]
          filesToUpload.forEach((f) => {
            upload.addItem(f, folderId, refetch)
          })
          e.target.value = null
        }}
      />
      <div className="w-full">
        <label htmlFor={'fileInput-' + id}>{children}</label>
      </div>
    </div>
  )
}
