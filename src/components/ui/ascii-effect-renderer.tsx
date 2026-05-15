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

	const width = size.width * gl.getPixelRatio()
	const height = size.height * gl.getPixelRatio()

	const renderTarget = useFBO(width, height)

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
				tDiffuse: { value: renderTarget.texture },
				tAsciiAtlas: { value: atlasTexture },
				charactersCount: { value: ASCII_CHARACTERS.length },
				resolution: {
					value: new Vector2(width, height),
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
		}
	}, [atlasTexture, renderTarget.texture, quadScene, width, height])

	useLayoutEffect(() => {
		if (!shaderMaterial.current) return

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
	}, [])

	useLayoutEffect(() => {
		if (shaderMaterial.current) {
			shaderMaterial.current.uniforms.resolution.value.set(width, height)
		}
	}, [width, height])

	const isAnimating = useRef(false)

	useLayoutEffect(() => {
		const handlePointerDown = () => {
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
		}

		const handlePointerEnter = () => {
			shaderMaterial.current.uniforms.isHovering.value = 1.0
		}
		const handlePointerLeave = () => {
			shaderMaterial.current.uniforms.isHovering.value = 0.0
		}

		gl.domElement.addEventListener('pointerdown', handlePointerDown)
		gl.domElement.addEventListener('pointerenter', handlePointerEnter)
		gl.domElement.addEventListener('pointerleave', handlePointerLeave)

		return () => {
			gl.domElement.removeEventListener('pointerdown', handlePointerDown)
			gl.domElement.removeEventListener('pointerenter', handlePointerEnter)
			gl.domElement.removeEventListener('pointerleave', handlePointerLeave)
		}
	}, [gl, shaderMaterial])

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
