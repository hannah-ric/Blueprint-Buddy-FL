// frontend/src/services/design-service.ts
import axios from 'axios'
import { Database } from './database'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export type Plan = {
  components: any[]
  materials: any[]
  joinery: any[]
  hardware: any[]
  cutList: any[]
  bom: any[]
  instructions: string[]
  modelUrl: string
}

export class DesignService {
  /** 
   * Sends user prompt + specs + lookup tables to GPT-4o,
   * receives back a structured Plan object. 
   */
  static async generatePlan(params: {
    prompt: string
    specs?: Record<string, any>
  }): Promise<Plan> {
    const { prompt, specs } = params

    // 1) Fetch lookup data in parallel
    const [components, materials, joinery, hardware] = await Promise.all([
      Database.getAll('/components'),
      Database.getAll('/materials'),
      Database.getAll('/joinery'),
      Database.getAll('/hardware'),
    ])

    // 2) Build the Chat payload
    const payload = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert furniture design assistant.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            prompt,
            specs: specs || {},
            components,
            materials,
            joinery,
            hardware,
          }),
        },
      ],
    }

    // 3) Call OpenAI
    const aiResp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    )

    const content = aiResp.data.choices[0].message.content
    // 4) Parse JSON
    const plan: Plan = JSON.parse(content)
    return plan
  }
}
