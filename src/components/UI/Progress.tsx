export default function Progress({ progress = 0, className = '' }) {
  return (
    <div className="w-full bg-gray-400 mt-2 rounded-xl overflow-hidden">
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
