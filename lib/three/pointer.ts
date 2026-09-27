"use client";

/**
 * Pointer position in normalised device coordinates (-1…1, y up). A plain mutable object —
 * written by one window listener, read inside useFrame, never triggers React renders.
 * (The canvas has pointer-events: none because the DOM sits on top of it.)
 */
export const pointer = { x: 0, y: 0, active: false };

export function trackPointer() {
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    pointer.active = true;
  };
  const onLeave = () => {
    pointer.active = false;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
  };
}
