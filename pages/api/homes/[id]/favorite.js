import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  const { id } = req.query
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  const home = await prisma.home.findUnique({
    where: {
      id,
    },
  })

  if (!home) {
    return res.status(404).json({ message: 'Record not found.' })
  }

  const { title, description, price, guests, beds, baths, image } = home
  switch (req.method) {
    case 'PUT':
      try {
        const updatedHome = await prisma.home.update({
          where: {
            id,
          },
          data: {
            title,
            description,
            price,
            guests,
            beds,
            baths,
            image,
            favoredBy: {
              connect: {
                id: user.id,
              },
            },
          },
        })
        return res.status(200).json(updatedHome)
      } catch (error) {
        return res
          .status(500)
          .json({ message: error?.message || 'Something went wrong.' })
      }
    case 'DELETE':
      try {
        const deletedHome = await prisma.home.update({
          where: {
            id,
          },
          data: {
            favoredBy: {
              disconnect: true,
            },
          },
        })
        return res.status(200).json(deletedHome)
      } catch (error) {
        return res
          .status(500)
          .json({ message: error?.message || 'Something went wrong.' })
      }

    default:
      res.setHeader('Allow', ['PATCH'])
      return res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
