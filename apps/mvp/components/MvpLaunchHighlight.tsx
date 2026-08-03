export function MvpLaunchHighlight({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mvp-launch-highlight ${compact ? "mvp-launch-highlight-compact" : ""}`}>
      <div className="mvp-launch-highlight-glow" aria-hidden />
      <div className="mvp-launch-highlight-content">
        <h2 className="mvp-launch-title">Live Blinkit MVP</h2>
        <p className="mvp-launch-lead">
          Shop groceries, place orders, track delivery, and get Groq-powered category picks on the{" "}
          <strong>For you</strong> tab — the full Smart Category Explorer experience.
        </p>
        {!compact && (
          <ul className="mvp-launch-features">
            <li>Product search &amp; cart checkout</li>
            <li>Post-delivery AI recommendations</li>
            <li>Starter packs with accept / snooze / dismiss</li>
          </ul>
        )}
        <a href="/mvp" target="_blank" rel="noopener noreferrer" className="btn btn-primary mvp-launch-btn">
          Open MVP in new tab →
        </a>
      </div>
      <div className="mvp-launch-preview" aria-hidden>
        <span>✨</span>
        <span>🛒</span>
        <span>📦</span>
      </div>
    </div>
  );
}
