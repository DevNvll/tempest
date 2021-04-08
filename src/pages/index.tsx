import MainLayout from '@components/Layouts/Main'
import Glow from '@components/UI/Glow'
import Progress from '@components/UI/Progress'

import { useStorage } from '@store/usage'

import {
  HiOutlineDocument,
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlineLink,
  HiOutlinePhotograph
} from 'react-icons/hi'
export default function IndexPage() {
  const { usage } = useStorage()
  return (
    <div className="p-14">
      <Glow className="absolute pointer-events-none z-[1] opacity-50" />
      <div className=" relative z-[2] flex flex-col w-full">
        <h1 className="py-4 text-4xl font-bold tracking-tight text-white">
          Hi, Henrick!
        </h1>
        <div className="mt-8 space-y-4">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight uppercase">
              Storage
            </h2>
            <p className="text-md">
              {usage?.sizeReadable}{' '}
              <span className="font-thin text-md">of {usage?.maxReadable}</span>
            </p>
          </div>
          <Progress
            progress={(usage?.size / usage?.max) * 100}
            className="pt-3"
            opacity
          />
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row w-full mt-4 space-x-2 text-white">
            <div className="flex flex-row items-center w-1/4 p-6 space-x-4 bg-gray-800 bg-opacity-50 shadow rounded-xl backdrop-filter backdrop-blur-3xl">
              <div className="p-4 bg-purple-500 shadow-purple-xl rounded-xl backdrop-filter backdrop-blur-lg from-purple-500 to-purple-600 bg-gradient-to-r">
                <HiOutlineLink className="text-3xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Shared files
                </h1>
                <span className="text-sm font-medium tracking-wider opacity-50">
                  132 files
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center w-1/4 p-6 space-x-4 bg-gray-800 bg-opacity-50 shadow rounded-xl backdrop-filter backdrop-blur-3xl">
              <div className="p-4 bg-red-500 shadow-red-xl rounded-xl backdrop-filter backdrop-lg from-red-500 to-red-600 bg-gradient-to-r">
                <HiOutlineDocumentText className="text-3xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Documents</h1>
                <span className="text-sm font-medium tracking-wider opacity-50">
                  132 files
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center w-1/4 p-6 space-x-4 bg-gray-800 bg-opacity-50 shadow rounded-xl backdrop-filter backdrop-blur-3xl">
              <div className="p-4 bg-blue-500 shadow-blue-xl rounded-xl backdrop-filter backdrop-blue-lg from-blue-500 to-blue-600 bg-gradient-to-r">
                <HiOutlinePhotograph className="text-3xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Media</h1>
                <span className="text-sm font-medium tracking-wider opacity-50">
                  132 files
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center w-1/4 p-6 space-x-4 bg-gray-800 bg-opacity-50 shadow rounded-xl backdrop-filter backdrop-blur-3xl">
              <div className="p-4 bg-indigo-600 shadow-indigo-xl rounded-xl backdrop-filter backdrop-lg from-indigo-500 to-indigo-600 bg-gradient-to-r">
                <HiOutlineFolder className="text-3xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Others</h1>
                <span className="text-sm font-medium tracking-wider opacity-50">
                  1232 files
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h2 className="text-xl font-bold uppercase">Recent Files</h2>
          <div className="w-full mt-4 overflow-hidden rounded-lg shadow-lg">
            <table className="min-w-full bg-gray-800 bg-opacity-50">
              <thead className="">
                <tr>
                  <th className="px-6 py-5 text-sm tracking-wider text-left uppercase">
                    Name
                  </th>
                  <th className="px-6 py-5 text-sm tracking-wider text-left uppercase">
                    Folder
                  </th>
                  <th className="px-6 py-5 text-sm tracking-wider text-left uppercase">
                    Last Modified
                  </th>
                </tr>
              </thead>
              <tbody className="divide-gray-900 divide-y-1">
                <tr className="overflow-hidden rounded-lg cursor-pointer hover:bg-gray-500 hover:bg-opacity-10">
                  <td className="flex flex-row items-center px-6 py-5 space-x-4 whitespace-nowrap ">
                    <HiOutlinePhotograph className="text-4xl text-blue-500" />
                    <span>mountain.jpg</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">Images</td>
                  <td className="px-6 py-5 whitespace-nowrap">Nov 13, 2020</td>
                </tr>
                <tr className="overflow-hidden rounded-lg cursor-pointer hover:bg-gray-500 hover:bg-opacity-10">
                  <td className="flex flex-row items-center px-6 py-5 space-x-4 whitespace-nowrap ">
                    <HiOutlineDocument className="text-4xl text-green-500" />
                    <span>templates.zip</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">My Files</td>
                  <td className="px-6 py-5 whitespace-nowrap">Nov 13, 2020</td>
                </tr>
                <tr className="overflow-hidden rounded-lg cursor-pointer hover:bg-gray-500 hover:bg-opacity-10">
                  <td className="flex flex-row items-center px-6 py-5 space-x-4 whitespace-nowrap ">
                    <HiOutlineDocumentText className="text-4xl text-red-500" />
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
    </div>
  )
}

IndexPage.Layout = MainLayout
