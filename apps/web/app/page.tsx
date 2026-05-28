import { semanticColors } from '@hausy/design-tokens';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: semanticColors.background,
        color: semanticColors.ink,
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: 32,
      }}>
      <h1>Hausy Web</h1>
      <p style={{ color: semanticColors.muted }}>
        Placeholder shell for the Phase 1 monorepo. Product UI remains in the Expo app.
      </p>
    </main>
  );
}
