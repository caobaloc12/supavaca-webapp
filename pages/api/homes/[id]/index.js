import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: { listedHomes: true },
  })
  const { id } = req.query
  if (!user?.listedHomes?.find((home) => home.id === id)) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  switch (req.method) {
    case 'PATCH':
      try {
        const home = await prisma.home.update({
          where: {
            id,
          },
          data: req.body,
        })
        return res.status(200).json(home)
      } catch (error) {
        return res
          .status(500)
          .json({ message: error?.message || 'Something went wrong.' })
      }
    case 'DELETE':
      try {
        const home = await prisma.home.delete({
          where: {
            id,
          },
        })
        if (home.image) {
          const path = home.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1]
          await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .remove([path])
        }
        return res.status(200).json({ message: 'Home deleted.' })
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
