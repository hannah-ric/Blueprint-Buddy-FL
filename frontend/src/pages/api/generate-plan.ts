// frontend/src/pages/api/generate-plan.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { DesignService } from '../../services/design-service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const { prompt, specs } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  try {
    const plan = await DesignService.generatePlan({ prompt, specs })
    return res.status(200).json(plan)
  } catch (err: any) {
    console.error('generate-plan error:', err)
    return res.status(500).json({ error: err.message || 'Internal Error' })
  }
}
