/**
 * Triggers standard browser window print.
 * Print CSS in index.css handles media queries:
 * - Hides navigation, action buttons, footers
 * - Applies clean high-contrast print layout
 * - Preserves Tamil typography and source metadata
 */
export function triggerPrintReport(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
