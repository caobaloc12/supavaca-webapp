import Layout from '@/components/Layout'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { prisma } from '@/lib/prisma'
import { HeartIcon } from '@heroicons/react/solid'
import { HeartIcon as HearIconOutline } from '@heroicons/react/outline'

export default function ListedHome(home = null) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const isOwner = useMemo(
    () => home?.ownerId === currentUser?.id,
    [home, currentUser]
  )

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: currentUser } = await axios.get(`/api/current-user`)
        setCurrentUser(currentUser)
      } catch (e) {
        setCurrentUser(null)
      }
    }
    if (home) {
      getCurrentUser()
    }
  }, [home])

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

  const toggleFavorite = async () => {
    if (!home) return

    let toastId = null
    const isRemoved = home.favoredById === currentUser?.id
    try {
      toastId = toast.loading('Please wait...')
      // Add/remove the home from the user's favorites
      await axios({
        url: `/api/homes/${home.id}/favorite`,
        method: isRemoved ? 'delete' : 'put',
      })
      toast.success(
        `${isRemoved ? 'Removed from' : 'Added to'} favorites successfully!`,
        { id: toastId }
      )
      router.replace(router.asPath)
    } catch (e) {
      console.log(e)
      toast.error(
        `Unable to ${
          isRemoved ? 'remove home from ' : 'add home to '
        } your favorites.`,
        { id: toastId }
      )
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

          <div className='flex space-x-6 items-center'>
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite()
              }}
            >
              {home?.favoredById === currentUser?.id ? (
                <HeartIcon
                  className={`w-7 h-7 drop-shadow transition text-red-500`}
                />
              ) : (
                <HearIconOutline className='w-7 h-7 text-gray-500 drop-shadow transition hover:text-red-400' />
              )}
            </button>
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
  const id = context.params.id
  const home = await prisma.home.findUnique({
    where: { id },
  })
  return {
    props: JSON.parse(JSON.stringify(home)),
  }
}
