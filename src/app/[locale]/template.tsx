/**
 * Re-mounts on every navigation: a short CSS fade so moving between pages feels continuous.
 * CSS (not JS) so content is visible before hydration; opacity only, so sticky sections still work.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="hk-page">{children}</div>;
}
