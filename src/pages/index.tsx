import MainLayout from '@components/Layouts/Main'
import Progress from '@components/UI/Progress'
import { useUI } from '@store/ui'
import { useStorage } from '@store/usage'
import useAuth from '@store/useAuth'
import {
  HiDocument,
  HiDocumentReport,
  HiDocumentText,
  HiFolder,
  HiOutlineDocument,
  HiOutlineDocumentReport,
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlineLink,
  HiOutlineMusicNote,
  HiOutlinePhotograph,
  HiOutlineShare
} from 'react-icons/hi'
export default function IndexPage() {
  const auth = useAuth()
  const { usage } = useStorage()
  return (
    <div className="p-14">
      <h1 className="text-4xl border-b border-gray-400 py-4 font-bold">
        Hi, Henrick!
      </h1>
      <div className="mt-8 space-y-4">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-bold">Storage</h2>
          <p className="text-md">
            {usage?.sizeReadable}{' '}
            <span className="font-thin text-md">of {usage?.maxReadable}</span>
          </p>
        </div>
        <Progress
          progress={(usage?.size / usage?.max) * 100}
          className="pt-3"
        />
      </div>
      <div className="flex flex-col mt-4">
        <h3 className="uppercase text-gray-100 font-bold">Storage Details</h3>
        <div className="flex flex-row space-x-2 w-full mt-4">
          <div className="flex flex-row bg-purple-500 rounded-xl bg-opacity-10 space-x-4 items-center w-1/4 p-6">
            <HiOutlineLink className="text-6xl text-purple-500" />
            <div>
              <h1 className="font-bold text-xl">Shared files</h1>
              <span className="text-sm font-medium opacity-80">132 files</span>
            </div>
          </div>
          <div className="flex flex-row bg-red-500 rounded-xl bg-opacity-10 space-x-4 items-center w-1/4 p-6">
            <HiOutlineDocumentText className="text-6xl text-red-500" />
            <div>
              <h1 className="font-bold text-xl">Documents</h1>
              <span className="text-sm font-medium opacity-80">132 files</span>
            </div>
          </div>
          <div className="flex flex-row bg-blue-500 rounded-xl bg-opacity-10 space-x-4 items-center w-1/4 p-6">
            <HiOutlinePhotograph className="text-6xl text-blue-500" />
            <div>
              <h1 className="font-bold text-xl">Media</h1>
              <span className="text-sm font-medium opacity-80">132 files</span>
            </div>
          </div>
          <div className="flex flex-row bg-green-500 rounded-xl bg-opacity-10 space-x-4 items-center w-1/4 p-6">
            <HiOutlineFolder className="text-6xl text-green-500" />
            <div>
              <h1 className="font-bold text-xl">Others</h1>
              <span className="text-sm font-medium opacity-80">1232 files</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <h2 className="text-xl font-bold">Recent Files</h2>
        <div className="w-full rounded-lg overflow-hidden border-2 border-gray-500 mt-4">
          <table className="min-w-full divide-y divide-gray-400">
            <thead className="border-b-2 border-gray-500">
              <tr>
                <th className="px-6 py-5 text-left text-sm uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-5 text-left text-sm uppercase tracking-wider">
                  Folder
                </th>
                <th className="px-6 py-5 text-left text-sm uppercase tracking-wider">
                  Last Modified
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="cursor-pointer hover:bg-gray-500 bg-opacity-10 rounded-lg overflow-hidden">
                <td className="flex flex-row px-6 py-5 whitespace-nowrap items-center space-x-4 ">
                  <HiOutlinePhotograph className="text-blue-500 text-4xl" />
                  <span>mountain.jpg</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">Images</td>
                <td className="px-6 py-5 whitespace-nowrap">Nov 13, 2020</td>
              </tr>
              <tr className="cursor-pointer hover:bg-gray-500 bg-opacity-10 rounded-lg overflow-hidden">
                <td className="flex flex-row px-6 py-5 whitespace-nowrap items-center space-x-4 ">
                  <HiOutlineDocument className="text-green-500 text-4xl" />
                  <span>templates.zip</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">My Files</td>
                <td className="px-6 py-5 whitespace-nowrap">Nov 13, 2020</td>
              </tr>
              <tr className="cursor-pointer hover:bg-gray-500 bg-opacity-10 rounded-lg overflow-hidden">
                <td className="flex flex-row px-6 py-5 whitespace-nowrap items-center space-x-4 ">
                  <HiOutlineDocumentText className="text-red-500 text-4xl" />
                  <span>Invoice - December.pdf</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">Invoices</td>
                <td className="px-6 py-5 whitespace-nowrap">Dec 21, 2020</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

IndexPage.Layout = MainLayout
