// frontend/src/pages/api/lookup/components.ts
import type { NextApiRequest, NextApiResponse } from 'next'

// Adjust the number of "../" so this points at your backend/src/db/models/index.js
const db = require('../../../../../backend/src/db/models')

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const list = await db.Component.findAll()
  return res.status(200).json(list)
}
