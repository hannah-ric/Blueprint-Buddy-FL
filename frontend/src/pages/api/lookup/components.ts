// frontend/src/pages/api/lookup/components.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// 5×“..” to back out of lookup → api → pages → src → frontend, then into backend/src/db/models
const db = require('../../../../../backend/src/db/models')

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const list = await db.Component.findAll()
  return res.status(200).json(list)
}
