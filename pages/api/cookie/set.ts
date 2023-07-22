import { setCookie } from "cookies-next"
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next"

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(401).end()

  const body = JSON.parse(req.body)
  setCookie('token', body.token, { req, res })

  res.status(200).end()
}

export default handler
