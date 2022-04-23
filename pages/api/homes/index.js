import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  // Create an new home
  if (req.method === 'POST') {
    const { image, title, description, price, guests, beds, baths } = req.body
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    const home = await prisma.home.create({
      data: {
        image,
        title,
        description,
        price,
        guests,
        beds,
        baths,
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    })
    res.status(200).json(home)
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed.` })
  }
}
