import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

import depthMap from '../../assets/models/depth-map.webp'
import modelTexture from '../../assets/models/model-texture.webp'

interface PlaneModelProps {
	isMobile: boolean
}

const DESKTOP_SEGMENTS = 230
const MOBILE_SEGMENTS = 64
const DESKTOP_PARALLAX = 0.1
const MOBILE_PARALLAX = 0.04

export function PlaneModel({ isMobile }: PlaneModelProps) {
	const [map, displacementMap] = useTexture([modelTexture.src, depthMap.src])

	const segments = isMobile ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS
	const parallaxStrength = isMobile ? MOBILE_PARALLAX : DESKTOP_PARALLAX

	useFrame(function updateCamera(state, delta) {
		const targetX = state.pointer.x * parallaxStrength
		const targetY = state.pointer.y * parallaxStrength

		state.camera.position.x = MathUtils.damp(
			state.camera.position.x,
			targetX,
			4,
			delta
		)
		state.camera.position.y = MathUtils.damp(
			state.camera.position.y,
			targetY,
			4,
			delta
		)
		state.camera.lookAt(0, 0, 0)
	})

	return (
		<mesh>
			<planeGeometry args={[1, 1, segments, segments]} />
			<meshStandardMaterial
				map={map}
				displacementMap={displacementMap}
				displacementScale={0.3}
				transparent
			/>
		</mesh>
	)
}
