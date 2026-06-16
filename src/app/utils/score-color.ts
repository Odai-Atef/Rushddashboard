/**
 * Returns a hex color for a numeric score based on the agreed score bands.
 *
 * - >= 80 : green
 * - 60-79 : blue
 * - 40-59 : yellow
 * - < 40  : red
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#3b82f6';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}
