import Layout from '@/components/Layout'
import axios from 'axios'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { prisma } from '@/lib/prisma'

export default function ListedHome(home = null) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const getOwner = async () => {
      try {
        const { data } = axios.get(`/api/homes/${home.id}/owner`)
        setIsOwner(data?.id === session?.user?.id)
      } catch (error) {}
    }
    if (home?.id && session?.user) {
      getOwner()
    }
  }, [session, home])

  const deleteHome = async () => {
    let toastId
    try {
      toastId = toast.loading('Deleting...')
      setDeleting(true)
      // Delete home from DB
      await axios.delete(`/api/homes/${home.id}`)
      // Redirect user
      toast.success('Successfully deleted', { id: toastId })
      router.push('/homes')
    } catch (e) {
      console.log(e)
      toast.error('Unable to delete home', { id: toastId })
      setDeleting(false)
    }
  }

  return (
    <Layout>
      <div className='max-w-screen-lg mx-auto flex flex-col relative space-y-5'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4'>
          <div>
            <h1 className='text-2xl font-semibold truncate'>
              {home?.title ?? ''}
            </h1>
            <ol className='inline-flex items-center space-x-1 text-gray-500'>
              <li>
                <span>{home?.guests ?? 0} guests</span>
                <span aria-hidden='true'> · </span>
              </li>
              <li>
                <span>{home?.beds ?? 0} beds</span>
                <span aria-hidden='true'> · </span>
              </li>
              <li>
                <span>{home?.baths ?? 0} baths</span>
              </li>
            </ol>
          </div>

          {isOwner ? (
            <div className='flex items-center space-x-2'>
              <button
                type='button'
                disabled={deleting}
                onClick={() => router.push(`/homes/${home.id}/edit`)}
                className='px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Edit
              </button>

              <button
                type='button'
                disabled={deleting}
                onClick={deleteHome}
                className='rounded-md border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none transition disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1'
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
        <div className='relative w-full h-full min-h-[400px]'>
          {home?.image && (
            <Image
              src={home?.image}
              alt={home?.title || ''}
              objectFit='scale-down'
              objectPosition='top'
              layout='fill'
            />
          )}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
  if (!session) {
    return redirect
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: { listedHomes: true },
  })

  // Check if authenticated user owns this home
  const id = context.params.id
  const home = user?.listedHomes?.find((home) => home.id === id)
  if (!home) {
    return redirect
  }
  return {
    props: JSON.parse(JSON.stringify(home)),
  }
}
