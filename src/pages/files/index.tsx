import { useRouter } from 'next/router'

import MainLayout from '@components/Layouts/Main'
import FilesDirectory from '@components/files/FilesDirectory'

export default function Index() {
  const router = useRouter()
  const folderId = router.query.folder_id as string

  return <FilesDirectory folderId={folderId} />
}

Index.Layout = MainLayout
