import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, useState } from 'react'

import HomeIcon from '../../assets/icons/home.svg?react'
import PencilIcon from '../../assets/icons/pencil.svg?react'
import XIcon from '../../assets/icons/x.svg?react'

const MINIMUM_DISPLAY_MS = 1500

gsap.registerPlugin(useGSAP)

export function LoadingScreen() {
	const containerRef = useRef<HTMLDivElement>(null)
	const [visible, setVisible] = useState(true)

	useGSAP(
		function (_, contextSafe) {
			const container = containerRef.current
			if (!container) return

			const dots = container.querySelectorAll('.dot')

			const dotTl = gsap.timeline({ repeat: -1 })
			dotTl
				.set(dots, { opacity: 0 })
				.to(
					dots,
					{
						opacity: 1,
						duration: 0,
						stagger: 0.3,
					},
					'+=0.3'
				)
				.to({}, { duration: 0.5 })

			const mountedAt = performance.now()

			const startExitAnimation = contextSafe!(function () {
				dotTl.kill()

				const isDesktop = window.matchMedia('(min-width: 768px)').matches
				const targetPadding = isDesktop ? '3rem' : '1rem'

				const exitTl = gsap.timeline({
					defaults: { ease: 'power2.inOut' },
					onComplete: function () {
						setVisible(false)
						document.dispatchEvent(new CustomEvent('loading:complete'))
					},
				})

				exitTl
					.to(container, {
						padding: targetPadding,
						duration: 0.6,
					})
					.to(container, {
						autoAlpha: 0,
						duration: 0.4,
					})
			})

			const elapsed = performance.now() - mountedAt
			const remaining = Math.max(0, MINIMUM_DISPLAY_MS - elapsed)
			const timerId = setTimeout(startExitAnimation, remaining)

			return function () {
				clearTimeout(timerId)
			}
		},
		{ scope: containerRef }
	)

	if (!visible) return null

	return (
		<div ref={containerRef} className='bg-background fixed inset-0 z-50 md:p-6'>
			<div className='border-border flex size-full flex-col border'>
				<header className='bg-border h-12 w-full px-3'>
					<div className='flex h-full w-full items-end gap-3 md:w-[40%]'>
						<div className='bg-background text-border border-border flex h-9 w-full items-center justify-between border-b px-3'>
							<div className='flex items-center gap-3'>
								<HomeIcon className='size-4' />
								<span className='font-semibold'>Home</span>
							</div>

							<XIcon className='size-4' />
						</div>

						<div className='bg-background text-border border-border flex h-9 w-full items-center justify-between border-b px-3'>
							<div className='flex items-center gap-3'>
								<PencilIcon className='size-4' />
								<span className='font-semibold'>Writing</span>
							</div>

							<XIcon className='size-4' />
						</div>
					</div>
				</header>
				<main className='flex grow items-center justify-center'>
					<span className='font-vt323 text-foreground flex text-[2rem] md:text-6xl'>
						<span>Loading</span>
						<span className='dot opacity-0'>.</span>
						<span className='dot opacity-0'>.</span>
						<span className='dot opacity-0'>.</span>
					</span>
				</main>
			</div>
		</div>
	)
}
