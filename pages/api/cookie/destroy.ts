import { deleteCookie } from "cookies-next"
import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end()
  deleteCookie('token', {
    req, res
  })

  return res.status(200).end()
}
