import Button from '@components/UI/Button'
import sleep from '@lib/sleep'
import { Auth } from 'aws-amplify'
import clsx from 'clsx'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { ClipLoader, DotLoader } from 'react-spinners'

function Input(props) {
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

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit({ email, password }) {
    try {
      await Auth.signIn({
        username: email,
        password: password
      })
      router.push('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-800 justify-center">
      <Formik
        onSubmit={handleSubmit}
        initialValues={{ email: '', password: '' }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col space-y-4 w-3/12">
            <h1 className="text-2xl font-bold self-center">Sign in</h1>
            <Input type="text" name="email" placeholder="E-mail" />
            <Input type="password" name="password" placeholder="Password" />
            <span className="self-end">Forgot Password</span>
            <Button type="submit" isLoading={isSubmitting}>
              Login
            </Button>
            <p className="self-center">
              Don't have an account?{' '}
              <Link href="/signup">
                <a>
                  <span className="font-bold text-primary-400">
                    Join Tempest
                  </span>
                </a>
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
