import axios from 'axios'
import Layout from '@/components/Layout'
import ListingForm from '@/components/ListingForm'
import { getSession } from 'next-auth/react'

const Create = () => {
  const addHome = async (data) => {
    try {
      const res = await axios.post(`/api/homes`, data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>List your home</h1>
        <p className='text-gray-500'>
          Fill out the form below to list a new home.
        </p>
        <div className='mt-8'>
          <ListingForm
            buttonText='Add home'
            redirectPath='/'
            onSubmit={addHome}
          />
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?redirect=/create',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}

export default Create
