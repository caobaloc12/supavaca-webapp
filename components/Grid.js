import Card from '@/components/Card'
import { ExclamationIcon } from '@heroicons/react/outline'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Grid = ({ homes }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const isEmpty = homes.length === 0

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: user } = await axios.get('/api/current-user')
        setCurrentUser(user)
      } catch (error) {
        setCurrentUser(null)
      }
    }
    if (session?.user) {
      getCurrentUser()
    }
  }, [session?.user])

  const toggleFavorite = async (id) => {
    const home = homes.find((home) => home.id === id)
    if (!home) return

    let toastId = null
    const isRemoved = home.favoredById === currentUser?.id
    try {
      toastId = toast.loading('Please wait...')
      // Add/remove the home from the user's favorites
      await axios({
        url: `/api/homes/${id}/favorite`,
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

  return isEmpty ? (
    <p className='text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1'>
      <ExclamationIcon className='shrink-0 w-5 h-5 mt-px' />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {homes.map((home) => (
        <Card
          key={home.id}
          {...home}
          favorite={currentUser?.id === home.favoredById}
          onClickFavorite={toggleFavorite}
        />
      ))}
    </div>
  )
}

export default Grid
