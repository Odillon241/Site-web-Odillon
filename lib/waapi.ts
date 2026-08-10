export type WaapiAnimationOptions = KeyframeAnimationOptions & {
  respectReducedMotion?: boolean
}

/**
 * Runs a native Web Animations API animation while honoring the user's
 * reduced-motion preference by default.
 */
export function animateElement(
  element: Element,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: WaapiAnimationOptions = {},
): Animation {
  const { respectReducedMotion = true, ...animationOptions } = options
  const shouldReduceMotion =
    respectReducedMotion &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return element.animate(keyframes, {
    ...animationOptions,
    duration: shouldReduceMotion ? 0 : animationOptions.duration,
  })
}
