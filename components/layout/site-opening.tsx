import Image from "next/image"
import styles from "./site-opening.module.css"

/**
 * Branded opening sequence for the public homepage.
 *
 * The sequence is CSS-only so it cannot delay hydration or leave the page
 * blocked when JavaScript is unavailable. It is decorative and never captures
 * pointer events.
 */
export function SiteOpening() {
  return (
    <div className={styles.opening} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.halo} />
      <div className={styles.axis} />

      <div className={styles.lockup}>
        <div className={styles.logoReveal}>
          <Image
            src="/images/logos/odillon-logo-white.svg"
            alt=""
            width={348}
            height={104}
            className={styles.logo}
            priority
          />
        </div>
        <div className={styles.progress}>
          <span />
        </div>
      </div>

      <div className={styles.accentWipe} />
    </div>
  )
}
