import rangeMap from '@lib/range-map'
import { NextSeo } from 'next-seo'
import {
  HiOutlineFolder,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineUser
} from 'react-icons/hi'
import cs from 'classnames'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useAuth from '@store/useAuth'
import { ClipLoader } from 'react-spinners'
import colors from '@constants/colors'
import { useEffect } from 'react'
import Glow from '@components/UI/Glow'

function SidebarItem({ Icon, label, color = 'primary', href = '/' }) {
  const router = useRouter()
  const isActive =
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href)
  return (
    <li className="flex flex-row items-center justify-center w-full px-8 text-4xl">
      <Link href={href}>
        <a>
          <button
            title={label}
            className={cs(
              'focus:outline-none text-4xl p-3 transition-all duration-150 ease-out rounded bg-opacity-10',
              {
                'bg-primary-600 text-primary-500':
                  color === 'primary' && isActive,
                'bg-purple-600 text-purple-500': color === 'purple' && isActive,
                'bg-yellow-600 text-yellow-500': color === 'yellow' && isActive,
                'hover:bg-gray-800': !isActive
              }
            )}
          >
            <Icon className="text-xl" />
          </button>
        </a>
      </Link>
    </li>
  )
}

export default function MainLayout({ children }) {
  const {
    state: { loading, user },
    operations: { signOut }
  } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading])

  return !loading && Boolean(user) ? (
    <>
      <NextSeo title="Tempest Files" />
      <div className="relative flex flex-row max-w-full min-h-screen bg-gray-900 ">
        <nav className="border-r-2 border-gray-400 border-opacity-20 relative w-[72px] bg-gray-900 h-screen justify-between flex flex-col py-4 overflow-hidden backdrop-filter backdrop-blur-3xl">
          <Glow
            color1="transparent"
            color2="#a503fc"
            className="absolute scale-150 -top-40 right-[-97%] w-72 h-80 bg-transparent pointer-events-none z-[-2] transform rotate-[90deg]"
          />
          <Glow
            color1="#16c5fa"
            color2="transparent"
            className="absolute scale-150 -bottom-24 -left-full w-72 h-80 bg-transparent pointer-events-none z-[-2] transform rotate-[-75deg]"
          />

          <ul className="flex flex-col justify-center flex-grow space-y-4">
            <SidebarItem label="Home" Icon={HiOutlineHome} href="/" />
            <SidebarItem
              label="Files"
              Icon={HiOutlineFolder}
              href="/files"
              color="yellow"
            />
            <SidebarItem
              label="Account"
              Icon={HiOutlineUser}
              href="/account"
              color="purple"
            />
          </ul>
          <div>
            <li className="flex flex-row items-center justify-center w-full px-8 text-4xl">
              <button
                onClick={() => signOut()}
                title="Logout"
                className={cs(
                  'focus:outline-none text-4xl p-3 transition-all duration-150 ease-out rounded hover:bg-opacity-10 hover:bg-red-600 hover:text-red-500'
                )}
              >
                <HiOutlineLogout className="text-xl" />
              </button>
            </li>
          </div>
        </nav>
        <div className="flex-grow h-screen">{children}</div>
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-600">
      <ClipLoader color={colors.primary[500]} />
    </div>
  )
}
