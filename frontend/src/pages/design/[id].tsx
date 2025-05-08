// frontend/src/pages/design/[id].tsx
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { ModelViewer } from '../../components/ModelViewer'
import { useState } from 'react'

const fetcher = (url: string) => axios.get(url).then(r => r.data)

const DesignDetail: React.FC = () => {
  const { query } = useRouter()
  const id = query.id as string
  const { data: plan, error } = useSWR(id ? `/api/plan/${id}` : null, fetcher)
  const [exploded, setExploded] = useState(false)

  if (error) return <p>Error loading plan.</p>
  if (!plan) return <p>Loading…</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Design Plan #{id}</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setExploded(x => !x)}
      >
        {exploded ? 'Show Assembled' : 'Show Exploded'}
      </button>
      <ModelViewer url={plan.modelUrl} exploded={exploded} />

      <h2 className="mt-8 text-xl font-semibold">Cut List</h2>
      <pre>{JSON.stringify(plan.cutList, null, 2)}</pre>

      <h2 className="mt-8 text-xl font-semibold">Bill of Materials</h2>
      <pre>{JSON.stringify(plan.bom, null, 2)}</pre>

      <h2 className="mt-8 text-xl font-semibold">Instructions</h2>
      <ol className="list-decimal ml-6">
        {plan.instructions.map((step: string, i: number) => (
          <li key={i} className="mb-2">{step}</li>
        ))}
      </ol>
    </div>
  )
}

export default DesignDetail
