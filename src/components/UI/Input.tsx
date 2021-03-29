import { Field } from 'formik'

export default function Input(props) {
  return (
    <Field
      className={
        'bg-gray-700 rounded-md border border-transparent focus:border-primary-500 py-3 px-4 placeholder-gray-100 font-bold text-gray-100 transition-all duration-150 ease-in-out ' +
        props.className
      }
      {...props}
    />
  )
}
