import Link from 'next/link'
import Image from 'next/image'
import { Formik, Form } from 'formik'
import { SparklesIcon } from '@heroicons/react/outline'
import Input from '@/components/Input'
import React from 'react'
import { SignInSchema } from '@/components/AuthModal'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import router from 'next/router'

export default function SignIn() {
  const [disabled, setDisabled] = React.useState(false)
  const [showSignIn, setShowSignIn] = React.useState(false)

  const signInWithGoogle = async () => {
    toast.loading('Redirecting...')
    const redirect = router.query.redirect || '/'
    setDisabled(true)
    signIn('google', { callbackUrl: redirect })
  }

  return (
    <div className='w-full h-screen flex justify-center items-center mg:max-w-[400px] md:mx-auto'>
      <div className='px-4 sm:px-12'>
        <div className='flex justify-center'>
          <Link href='/'>
            <a className='flex items-center space-x-1'>
              <SparklesIcon className='shrink-0 w-8 h-8 text-rose-500' />
              <span className='text-xl font-semibold tracking-wide'>
                Supa<span className='text-rose-500'>Vacation</span>
              </span>
            </a>
          </Link>
        </div>

        <h3 className='mt-6 font-bold text-lg sm:text-2xl text-center'>
          {showSignIn ? 'Welcome back!' : 'Create your account'}
        </h3>

        {!showSignIn ? (
          <p className='mt-2 text-gray-500 text-base text-center'>
            Please create an account to list your homes and bookmark your
            favorite ones.
          </p>
        ) : null}

        <div className='mt-10'>
          {/* Sign with Google */}
          <button
            disabled={disabled}
            onClick={() => signInWithGoogle()}
            className='h-[46px] w-full mx-auto border rounded-md p-2 flex justify-center items-center space-x-2 text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors'
          >
            <Image src='/google.svg' alt='Google' width={32} height={32} />
            <span>Sign {showSignIn ? 'in' : 'up'} with Google</span>
          </button>

          {/* Sign with email */}
          <Formik
            initialValues={{ email: '' }}
            validationSchema={SignInSchema}
            validateOnBlur={false}
            onSubmit={() => {}}
          >
            {({ isSubmitting, isValid, values, resetForm }) => (
              <Form className='mt-4'>
                <Input
                  name='email'
                  type='email'
                  placeholder='elon@spacex.com'
                  disabled={disabled}
                  spellCheck={false}
                />

                <button
                  type='submit'
                  disabled={disabled || !isValid}
                  className='mt-6 w-full bg-rose-600 text-white py-2 px-8 rounded-md focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600'
                >
                  {isSubmitting
                    ? 'Loading...'
                    : `Sign ${showSignIn ? 'in' : 'up'}`}
                </button>

                <p className='mt-2 text-center text-sm text-gray-500'>
                  {showSignIn ? (
                    <>
                      Don&apos;t have an account yet?{' '}
                      <button
                        type='button'
                        disabled={disabled}
                        onClick={() => {
                          setShowSignIn(false)
                          resetForm()
                        }}
                        className='underline underline-offset-1 font-semibold text-rose-500 hover:text-rose-600 disabled:hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Sign up
                      </button>
                      .
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type='button'
                        disabled={disabled}
                        onClick={() => {
                          setShowSignIn(true)
                          resetForm()
                        }}
                        className='underline underline-offset-1 font-semibold text-rose-500 hover:text-rose-600 disabled:hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Log in
                      </button>
                      .
                    </>
                  )}
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
