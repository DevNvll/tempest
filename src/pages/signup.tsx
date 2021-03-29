import Button from '@components/UI/Button'
import Input from '@components/UI/Input'
import { Auth } from 'aws-amplify'
import { Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function SignupPage() {
  const router = useRouter()

  async function handleSubmit({ email, password }) {
    try {
      await Auth.signUp({
        username: email,
        password: password
      })
      // router.push('/')
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
            <h1 className="text-2xl font-bold self-center">Sign Up</h1>
            <Input type="text" name="email" placeholder="E-mail" />
            <Input type="password" name="password" placeholder="Password" />
            <Button type="submit" isLoading={isSubmitting}>
              Create Account
            </Button>
            <p className="self-center">
              Already have an account?{' '}
              <Link href="/login">
                <a>
                  <span className="font-bold text-primary-400">Login</span>
                </a>
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
