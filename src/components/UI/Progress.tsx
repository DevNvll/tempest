import clsx from 'clsx'

export default function Progress({
  progress = 0,
  className = '',
  opacity = false
}) {
  return (
    <div
      className={clsx('w-full mt-2 overflow-hidden bg-gray-400 rounded-xl', {
        'bg-opacity-40 backdrop-filter backdrop-blur-3xl': opacity
      })}
    >
      <div
        className={
          'bg-primary-500 text-xs leading-none pt-1 text-center text-white rounded-xl ' +
          className
        }
        style={{ width: progress + '%' }}
      />
    </div>
  )
}
