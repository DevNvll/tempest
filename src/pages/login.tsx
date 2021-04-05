import Button from '@components/UI/Button'
import Input from '@components/UI/Input'
import { getCognitoErrorMessage } from '@lib/auth/getCognitoErrorMessage'
import { useUI } from '@store/ui'
import { Auth } from 'aws-amplify'
import { Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const ui = useUI()

  async function handleSubmit({ email, password }) {
    try {
      await Auth.signIn({
        username: email,
        password: password
      })
      router.push('/')
    } catch (err) {
      const message = getCognitoErrorMessage(err)
      ui.toast(message, 'error')
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
