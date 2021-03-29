import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'

export default function Button({
  children,
  isLoading = false,
  variant = 'primary',
  ...props
}) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && ref.current.getBoundingClientRect().width) {
      setWidth(ref.current.getBoundingClientRect().width)
    }
    if (ref.current && ref.current.getBoundingClientRect().height) {
      setHeight(ref.current.getBoundingClientRect().height)
    }
  }, [children])

  const variants = {
    primary:
      'bg-gradient-from-l bg-gradient-to-r from-primary-700 to-primary-600',
    link: 'bg-transparent'
  }

  return (
    <button
      ref={ref}
      className={clsx(
        'rounded-md py-3 min-w-[50px] px-4 font-bold flex items-center justify-center focus:outline-none',
        variants[variant],
        {
          'opacity-50 cursor-default': isLoading
        }
      )}
      style={
        width && height
          ? {
              width: `${width}px`,
              height: `${height}px`
            }
          : {}
      }
      {...props}
    >
      {!isLoading ? children : <ClipLoader size={20} color="white" />}
    </button>
  )
}
