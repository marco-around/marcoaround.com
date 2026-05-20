import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'

import { AsciiEffectRenderer } from './ascii-effect-renderer'
import { PlaneModel } from './plane-model'

const MOBILE_BREAKPOINT = 768

export function Model() {
	const isMobile = useMemo(() => window.innerWidth < MOBILE_BREAKPOINT, [])

	return (
		<div className='relative size-full touch-none overflow-hidden'>
			<Canvas camera={{ fov: 45, position: [0, 0, 1.5] }} dpr={[1, 2]}>
				<ambientLight intensity={1.5} />
				<AsciiEffectRenderer isMobile={isMobile} />
				<PlaneModel isMobile={isMobile} />
			</Canvas>
		</div>
	)
}
