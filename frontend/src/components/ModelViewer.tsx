// frontend/src/components/ModelViewer.tsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

type ModelViewerProps = {
  url: string
  exploded?: boolean
}

const InnerModel: React.FC<ModelViewerProps> = ({ url, exploded = false }) => {
  const { scene, nodes } = useGLTF(url)
  // Optionally offset each mesh in 'nodes' if exploded === true
  return <primitive object={scene} />
}

export const ModelViewer: React.FC<ModelViewerProps> = ({ url, exploded }) => (
  <div style={{ width: '100%', height: '500px' }}>
    <Canvas>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <InnerModel url={url} exploded={exploded} />
      <OrbitControls />
    </Canvas>
  </div>
)
