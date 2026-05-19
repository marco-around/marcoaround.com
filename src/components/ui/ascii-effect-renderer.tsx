import { useGSAP } from '@gsap/react'
import { useFBO } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
	Color,
	Mesh,
	OrthographicCamera,
	PlaneGeometry,
	Scene,
	ShaderMaterial,
	Vector2,
} from 'three'

import fragmentShader from '../../shaders/fragment-shader.glsl?raw'
import vertexShader from '../../shaders/vertex-shader.glsl?raw'
import { createAsciiAtlas } from '../../utils/create-ascii-atlas'

const ASCII_CHARACTERS =
	" `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@"

export function AsciiEffectRenderer() {
	const { gl, scene, camera, size } = useThree()

	const renderTarget = useFBO()

	const quadScene = useMemo(() => new Scene(), [])
	const quadCamera = useMemo(
		() => new OrthographicCamera(-1, 1, 1, -1, 0, 1),
		[]
	)

	const shaderMaterial = useRef<ShaderMaterial>(null!)
	const atlasTexture = useMemo(() => createAsciiAtlas(ASCII_CHARACTERS, 10), [])

	useLayoutEffect(() => {
		const geometry = new PlaneGeometry(2, 2)
		const material = new ShaderMaterial({
			transparent: true,
			uniforms: {
				tDiffuse: { value: null },
				tAsciiAtlas: { value: atlasTexture },
				charactersCount: { value: ASCII_CHARACTERS.length },
				resolution: {
					value: new Vector2(1, 1),
				},
				fontSize: { value: 6 },
				mousePosition: { value: new Vector2(-10, -10) },
				hoverRadius: { value: 0.07 },
				hoverColor: { value: new Color('#B95DFF') },
				waveRadius: { value: 3.0 },
				waveCenter: { value: new Vector2(0, 0) },
				colorState: { value: 0.0 },
				isHovering: { value: 0.0 },
				initWave1Radius: { value: 0.0 },
				initWave2Radius: { value: 0.0 },
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
		})

		shaderMaterial.current = material

		const quadMesh = new Mesh(geometry, material)
		quadScene.add(quadMesh)

		return () => {
			material.dispose()
			geometry.dispose()
			quadScene.remove(quadMesh)
		}
	}, [atlasTexture, quadScene])

	const { contextSafe } = useGSAP((_, ctxSafe) => {
		if (!shaderMaterial.current) return

		const startEntranceAnimation = ctxSafe!(function () {
			gsap.to(shaderMaterial.current.uniforms.initWave1Radius, {
				value: 3.0,
				duration: 2.5,
				delay: 0.2,
				ease: 'power1.inOut',
			})

			gsap.to(shaderMaterial.current.uniforms.initWave2Radius, {
				value: 3.0,
				duration: 2.5,
				delay: 0.3,
				ease: 'power1.inOut',
			})
		})

		document.addEventListener('loading:complete', startEntranceAnimation, {
			once: true,
		})

		return function () {
			document.removeEventListener('loading:complete', startEntranceAnimation)
		}
	}, [])

	useLayoutEffect(() => {
		if (shaderMaterial.current) {
			shaderMaterial.current.uniforms.resolution.value.set(size.width, size.height)
			shaderMaterial.current.uniforms.tDiffuse.value = renderTarget.texture
		}
	}, [size.width, size.height, renderTarget.texture])

	const isAnimating = useRef(false)

	useLayoutEffect(() => {
		const handlePointerDown = contextSafe(() => {
			if (!shaderMaterial.current || isAnimating.current) return
			isAnimating.current = true

			const mPos = shaderMaterial.current.uniforms.mousePosition.value
			shaderMaterial.current.uniforms.waveCenter.value.set(mPos.x, mPos.y)
			shaderMaterial.current.uniforms.colorState.value =
				shaderMaterial.current.uniforms.colorState.value === 0.0 ? 1.0 : 0.0
			shaderMaterial.current.uniforms.waveRadius.value = 0.0

			gsap.killTweensOf(shaderMaterial.current.uniforms.waveRadius)
			gsap.to(shaderMaterial.current.uniforms.waveRadius, {
				value: 3.0,
				duration: 2.5,
				ease: 'power1.inOut',
				onComplete: () => {
					isAnimating.current = false
				},
			})
		})

		const handlePointerEnter = () => {
			if (shaderMaterial.current) shaderMaterial.current.uniforms.isHovering.value = 1.0
		}
		
		const handlePointerLeave = () => {
			if (shaderMaterial.current) shaderMaterial.current.uniforms.isHovering.value = 0.0
		}

		const canvas = gl.domElement
		canvas.addEventListener('pointerdown', handlePointerDown)
		canvas.addEventListener('pointerenter', handlePointerEnter)
		canvas.addEventListener('pointerleave', handlePointerLeave)

		return () => {
			canvas.removeEventListener('pointerdown', handlePointerDown)
			canvas.removeEventListener('pointerenter', handlePointerEnter)
			canvas.removeEventListener('pointerleave', handlePointerLeave)
		}
	}, [gl, contextSafe])

	useFrame((state) => {
		if (shaderMaterial.current) {
			shaderMaterial.current.uniforms.mousePosition.value.set(
				(state.pointer.x + 1.0) / 2.0,
				(state.pointer.y + 1.0) / 2.0
			)
		}

		gl.setRenderTarget(renderTarget)
		gl.render(scene, camera)

		gl.setRenderTarget(null)
		gl.clear()
		gl.render(quadScene, quadCamera)
	}, 1)

	return null
}
