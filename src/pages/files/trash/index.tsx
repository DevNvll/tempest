import { useRouter } from 'next/router'

import MainLayout from '@components/Layouts/Main'
import FilesDirectory from '@components/files/FilesDirectory'

export default function Trash() {
  return <FilesDirectory root="trash" />
}

Trash.Layout = MainLayout
