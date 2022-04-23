import Layout from '@/components/Layout'
import axios from 'axios'
import { getSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { prisma } from '@/lib/prisma'
import Grid from '@/components/Grid'

export default function Favorites({ homes = [] }) {
  const toggleFavorite = async (id) => {
    const home = homes.find((home) => home.id === id)
    if (!home) return
    let toastId = null
    try {
      // Add/remove the home from the user's favorites
      await axios.put(`/api/homes/${id}/favorite`)
      toastId = toast.success('Removed from favorites successfully!')
    } catch (e) {
      console.log(e)
      toast.error('Unable to remove home from your favorites', { id: toastId })
    }
  }

  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Your listings</h1>
      <p className='text-gray-500'>
        Manage your homes and update your listings
      </p>
      <div className='mt-8'>
        <Grid homes={homes} toggleFavorite={toggleFavorite} />
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
  })
  const favoriteHomes = await prisma.home.findMany({
    where: {
      favoredById: user?.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  return {
    props: {
      homes: JSON.parse(JSON.stringify(favoriteHomes)),
    },
  }
}
