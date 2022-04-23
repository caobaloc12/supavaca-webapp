import { nanoid } from 'nanoid'
import { decode } from 'base64-arraybuffer'
import { supabase } from '@/lib/supabase'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  // Upload image to Supabase
  if (req.method === 'POST') {
    const image = req.body.image
    if (!image) {
      return res.status(500).json({ message: 'Image is required.' })
    }

    try {
      const contentType = image.match(/data:(.*);base64/)?.[1]
      const base64FileData = image.split('base64,')?.[1]
      if (!contentType || !base64FileData) {
        return res.status(500).json({ message: 'Image data not valid' })
      }

      const fileName = nanoid()
      const ext = contentType.split('/')[1]
      const filePath = `${fileName}.${ext}`
      const { data, error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(filePath, decode(base64FileData), {
          contentType,
          upsert: true,
        })
      if (uploadError) {
        throw new Error('Unable to upload image to storage')
      }
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.Key}`
      console.log({ url })
      return res.status(200).json({ url })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed.` })
  }
}
