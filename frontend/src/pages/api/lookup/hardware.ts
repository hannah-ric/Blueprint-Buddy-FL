// frontend/src/pages/api/lookup/hardware.ts
import type { NextApiRequest, NextApiResponse } from 'next'
const db = require('../../../../../backend/src/db/models')

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const list = await db.HardwareFastener.findAll()
  return res.status(200).json(list)
}
