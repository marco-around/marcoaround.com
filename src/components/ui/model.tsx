import { Canvas } from '@react-three/fiber'

import { AsciiEffectRenderer } from './ascii-effect-renderer'
import { PlaneModel } from './plane-model'

export function Model() {
	return (
		<div className='relative size-full overflow-hidden'>
			<Canvas camera={{ fov: 45, position: [0, 0, 1.5] }}>
				<ambientLight intensity={1.5} />
				<AsciiEffectRenderer />
				<PlaneModel />
			</Canvas>
		</div>
	)
}
