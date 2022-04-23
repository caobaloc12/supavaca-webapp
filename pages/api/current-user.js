import { prisma } from '@/lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })
    res.status(200).json(user)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed.` })
  }
}
