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
import { CircleLoader, ClipLoader, RotateLoader } from 'react-spinners'
import colors from '@constants/colors'
import { useEffect } from 'react'

function SidebarItem({ Icon, label, color = 'primary', href = '/' }) {
  const router = useRouter()
  const isActive =
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href)
  return (
    <li className="w-full flex flex-row items-center justify-center px-8 text-4xl">
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
      <NextSeo
        title="Exsign Studio"
        description="Uma equipe de designers e desenvolvedores de ponta com o objetivo de trazer a experiência e design que seus usuários merecem."
      />
      <div className="flex flex-row min-h-screen overflow-hidden bg-gray-700 relative max-w-full">
        <nav className="w-[72px] bg-gray-700 h-full absolute top-0 justify-between flex flex-col py-4">
          <ul className="flex flex-col flex-grow space-y-4">
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
            <li className="w-full flex flex-row items-center justify-center px-8 text-4xl">
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
        <div className="bg-gray-900 flex-grow pl-[72px]">{children}</div>
      </div>
    </>
  ) : (
    <div className="min-h-screen w-full bg-gray-600 flex flex-col items-center justify-center">
      <ClipLoader color={colors.primary[500]} />
    </div>
  )
}
