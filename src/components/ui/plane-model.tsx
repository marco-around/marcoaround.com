import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

import depthMap from '../../assets/models/depth-map.webp'
import modelTexture from '../../assets/models/model-texture.webp'

export function PlaneModel() {
	const [map, displacementMap] = useTexture([modelTexture.src, depthMap.src])

	useFrame((state) => {
		const targetX = state.pointer.x * 0.1
		const targetY = state.pointer.y * 0.1

		state.camera.position.x = MathUtils.lerp(
			state.camera.position.x,
			targetX,
			0.1
		)
		state.camera.position.y = MathUtils.lerp(
			state.camera.position.y,
			targetY,
			0.1
		)
		state.camera.lookAt(0, 0, 0)
	})

	return (
		<mesh>
			<planeGeometry args={[1, 1, 230, 230]} />
			<meshStandardMaterial
				map={map}
				displacementMap={displacementMap}
				displacementScale={0.3}
				transparent
			/>
		</mesh>
	)
}
