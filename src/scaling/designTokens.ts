/** Design surface @ 2560×1440, 16px = 1rem at scale 1 */
export const DESIGN_WIDTH_PX = 2560;
export const DESIGN_HEIGHT_PX = 1440;
export const ROOT_PX_PER_REM = 16;

export const CANVAS_WIDTH_REM = DESIGN_WIDTH_PX / ROOT_PX_PER_REM; // 160
export const CANVAS_HEIGHT_REM = DESIGN_HEIGHT_PX / ROOT_PX_PER_REM; // 90

/** Grid background — full artboard (2560×1440) */
export const GRID_BG_WIDTH_PX = 2560;
export const GRID_BG_HEIGHT_PX = 1440;
export const GRID_BG_WIDTH_REM = GRID_BG_WIDTH_PX / ROOT_PX_PER_REM; // 160
export const GRID_BG_HEIGHT_REM = GRID_BG_HEIGHT_PX / ROOT_PX_PER_REM; // 90

export function containScale(
  viewportWidth: number,
  viewportHeight: number,
): number {
  return Math.min(
    viewportWidth / DESIGN_WIDTH_PX,
    viewportHeight / DESIGN_HEIGHT_PX,
  );
}

export function rootFontSizePx(scale: number): number {
  return ROOT_PX_PER_REM * scale;
}

/** Convert a design-pixel size to rem (16px = 1rem at scale 1). */
export function designPxToRem(designPx: number): number {
  return designPx / ROOT_PX_PER_REM;
}

/**
 * Map design px → screen px, rounded to a whole pixel at the current scale.
 * Avoids sub-pixel hairlines when root font-size is fractional.
 */
export function designPxToRoundedScreenPx(
  designPx: number,
  scale: number,
): number {
  return Math.max(1, Math.round(designPx * scale));
}
