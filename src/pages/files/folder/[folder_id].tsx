import { useRouter } from 'next/router'

import MainLayout from '@components/Layouts/Main'
import FilesDirectory from '@components/files/FilesDirectory'

export default function Index() {
  return <FilesDirectory />
}

Index.Layout = MainLayout
