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

const DESKTOP_FONT_SIZE = 6
const MOBILE_FONT_SIZE = 4
const DESKTOP_HOVER_RADIUS = 0.07
const MOBILE_HOVER_RADIUS = 0.12

const WAVE_MAX_RADIUS = 3.0
const WAVE_DURATION = 2.2
const WAVE_EASE = 'power1.inOut'

interface AsciiEffectRendererProps {
	isMobile: boolean
}

export function AsciiEffectRenderer({ isMobile }: AsciiEffectRendererProps) {
	const { gl, scene, camera, size } = useThree()

	const renderTarget = useFBO()

	const quadScene = useMemo(() => new Scene(), [])
	const quadCamera = useMemo(
		() => new OrthographicCamera(-1, 1, 1, -1, 0, 1),
		[]
	)

	const shaderMaterial = useRef<ShaderMaterial>(null!)

	const fontSize = isMobile ? MOBILE_FONT_SIZE : DESKTOP_FONT_SIZE
	const hoverRadius = isMobile ? MOBILE_HOVER_RADIUS : DESKTOP_HOVER_RADIUS

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
				fontSize: { value: fontSize },
				mousePosition: { value: new Vector2(-10, -10) },
				hoverRadius: { value: hoverRadius },
				hoverColor: { value: new Color('#B95DFF') },
				waveRadius: { value: 3.0 },
				waveCenter: { value: new Vector2(0.5, 0.5) },
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
	}, [atlasTexture, quadScene, fontSize, hoverRadius])

	const { contextSafe } = useGSAP((_, ctxSafe) => {
		if (!shaderMaterial.current) return

		const startEntranceAnimation = ctxSafe!(function () {
			gsap.to(shaderMaterial.current.uniforms.initWave1Radius, {
				value: WAVE_MAX_RADIUS,
				duration: 2.5,
				delay: 0.2,
				ease: 'power1.inOut',
			})

			gsap.to(shaderMaterial.current.uniforms.initWave2Radius, {
				value: WAVE_MAX_RADIUS,
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
	const touchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
	const hasPointerMoved = useRef(false)

	useLayoutEffect(() => {
		const handlePointerDown = contextSafe(function onPointerDown() {
			if (!shaderMaterial.current || isAnimating.current) return
			isAnimating.current = true

			const uniforms = shaderMaterial.current.uniforms

			const mPos = uniforms.mousePosition.value
			uniforms.waveCenter.value.set(mPos.x, mPos.y)
			uniforms.colorState.value = uniforms.colorState.value < 0.5 ? 1.0 : 0.0
			uniforms.waveRadius.value = 0.0

			gsap.to(uniforms.waveRadius, {
				value: WAVE_MAX_RADIUS,
				duration: WAVE_DURATION,
				ease: WAVE_EASE,
				onComplete: function () {
					isAnimating.current = false
				},
			})
		})

		function handlePointerMove() {
			hasPointerMoved.current = true
		}

		function handlePointerEnter() {
			if (!shaderMaterial.current) return
			shaderMaterial.current.uniforms.isHovering.value = 1.0
			if (touchTimeout.current) clearTimeout(touchTimeout.current)
		}

		function handlePointerLeave() {
			if (!shaderMaterial.current) return
			shaderMaterial.current.uniforms.isHovering.value = 0.0
		}

		// On touch devices, pointerleave doesn't fire reliably after touch end.
		// Force-reset hover state after touch completes.
		function handlePointerUp(event: PointerEvent) {
			if (event.pointerType !== 'touch' || !shaderMaterial.current) return

			if (touchTimeout.current) clearTimeout(touchTimeout.current)
			touchTimeout.current = setTimeout(function () {
				if (shaderMaterial.current) {
					shaderMaterial.current.uniforms.isHovering.value = 0.0
				}
			}, 300)
		}

		const canvas = gl.domElement
		canvas.addEventListener('pointerdown', handlePointerDown)
		canvas.addEventListener('pointermove', handlePointerMove)
		canvas.addEventListener('pointerenter', handlePointerEnter)
		canvas.addEventListener('pointerleave', handlePointerLeave)
		canvas.addEventListener('pointerup', handlePointerUp)

		return () => {
			canvas.removeEventListener('pointerdown', handlePointerDown)
			canvas.removeEventListener('pointermove', handlePointerMove)
			canvas.removeEventListener('pointerenter', handlePointerEnter)
			canvas.removeEventListener('pointerleave', handlePointerLeave)
			canvas.removeEventListener('pointerup', handlePointerUp)
			if (touchTimeout.current) clearTimeout(touchTimeout.current)
		}
	}, [gl, contextSafe])

	useFrame(function renderAsciiPass(state) {
		if (shaderMaterial.current && hasPointerMoved.current) {
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
