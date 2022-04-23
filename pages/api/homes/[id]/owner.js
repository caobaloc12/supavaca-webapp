import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  const { id } = req.query

  switch (req.method) {
    case 'GET':
      try {
        const home = await prisma.home.findUnique({
          where: {
            id,
          },
          select: { owner: true },
        })
        return res.status(200).json(home.owner)
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
