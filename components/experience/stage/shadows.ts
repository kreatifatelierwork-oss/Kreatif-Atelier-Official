/** Places that animate shadow-casting things (flights turning, stones rising) ask for the shadow map to be redrawn. */
export const shadowDirty = { frames: 0 };
export const markShadows = (frames = 2) => { shadowDirty.frames = Math.max(shadowDirty.frames, frames); };
