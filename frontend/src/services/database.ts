// frontend/src/services/database.ts
import axios from 'axios'

// Base URL for our own API routes
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export class Database {
  static async getAll<T>(path: string): Promise<T[]> {
    const res = await axios.get<T[]>(`${API_BASE}/api/lookup/${path}`)
    return res.data
  }
}