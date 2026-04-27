/**
 * Shared animation variants following Emil Kowalski's animation best practices:
 * - ease-out as default easing
 * - Keep UI animations under 300ms
 * - Animate only transform and opacity (GPU-composited)
 * - Stagger child animations for orchestration
 * - Respect prefers-reduced-motion
 */

import type { Variants } from 'framer-motion';

// ── Easing Curves ──────────────────────────────────────────────
// Typed as [number, number, number, number] tuples for Framer Motion
type CubicBezier = [number, number, number, number];

const EASE_OUT: CubicBezier = [0.25, 0.1, 0.25, 1];         // Standard ease-out
const EASE_OUT_EXPO: CubicBezier = [0.16, 1, 0.3, 1];       // Punchy ease-out

// ── Page Container ─────────────────────────────────────────────
// Fades & slides the whole page in
export const pageContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: EASE_OUT,
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// ── Fade Up (child) ────────────────────────────────────────────
// Standard stagger child: fade in + slide up 12px
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: EASE_OUT,
    },
  },
};

// ── Fade In (child) ────────────────────────────────────────────
// Pure opacity fade, used as reduced-motion fallback
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: EASE_OUT,
    },
  },
};

// ── Scale Fade (for logo / hero elements) ──────────────────────
// Scale from 0.95 (never 0!) + opacity
export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: EASE_OUT_EXPO,
    },
  },
};

// ── Slide In From Left ─────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: EASE_OUT,
    },
  },
};

// ── Slide In From Right ────────────────────────────────────────
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: EASE_OUT,
    },
  },
};

// ── Stagger Container (for lists / search results) ─────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// ── Search Result Item ─────────────────────────────────────────
export const resultItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: EASE_OUT,
    },
  },
};

// ── Button press (whileTap) ────────────────────────────────────
// Scale to 0.97 on press — 150ms ease-out
export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.15, ease: EASE_OUT },
};

// ── Button hover ───────────────────────────────────────────────
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.15, ease: EASE_OUT },
};

// ── Toolbar slide down ─────────────────────────────────────────
export const toolbarSlide: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: EASE_OUT,
    },
  },
};

// ── Footer slide up ────────────────────────────────────────────
export const footerSlide: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    },
  },
};
