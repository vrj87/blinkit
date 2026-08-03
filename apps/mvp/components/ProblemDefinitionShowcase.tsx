"use client";

import Link from "next/link";
import { getProblemDefinition } from "@/lib/problem-definition";
import type { ThemeData } from "@/lib/research-questions";
import { ScrapedQuoteCard } from "@/components/ScrapedQuoteCard";

export function ProblemDefinitionShowcase({
  embedded = false,
  themes,
}: {
  embedded?: boolean;
  themes?: ThemeData[];
}) {
  const frame = getProblemDefinition();

  return (
    <div className={embedded ? "part3-embedded" : "part3-page"}>
      {!embedded && (
        <section className="part1-hero card">
          <p className="part1-eyebrow">Smart Category Explorer · Part 3</p>
          <h1>Define the problem</h1>
          <p className="part1-lead">
            From AI discovery and primary research — who we serve, why exploration stalls,
            what users do instead, and why Smart Category Explorer is worth building.
          </p>
          <div className="part1-hero-stats part1-hero-stats-simple">
            <div>
              <span className="part1-stat-value">6</span>
              <span className="part1-stat-label">interviews validated</span>
            </div>
            <div>
              <span className="part1-stat-value">40</span>
              <span className="part1-stat-label">survey responses</span>
            </div>
            <div>
              <span className="part1-stat-value">10</span>
              <span className="part1-stat-label">AI themes checked</span>
            </div>
          </div>
        </section>
      )}

      <section className="part1-section">
        <h2>Target user segment</h2>
        <p className="part1-section-lead">{frame.segment.summary}</p>
        <div className="part3-segment-grid">
          <div className="card part3-persona-card">
            <p className="part3-persona-label">{frame.segment.name}</p>
            <h3>{frame.segment.persona.name}</h3>
            <p className="part3-persona-meta">
              {frame.segment.persona.age}, {frame.segment.persona.context}
            </p>
            <ul className="part3-trait-list">
              {frame.segment.traits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <blockquote className="part3-persona-quote">
              &ldquo;{frame.segment.persona.quote}&rdquo;
            </blockquote>
            <p className="part3-demo-link">
              <Link href={`/demo/user/${frame.segment.persona.demoUserId}`}>
                Open demo profile →
              </Link>
              {!embedded && (
                <>
                  {" · "}
                  <a href="/mvp" target="_blank" rel="noopener noreferrer">
                    Open live MVP →
                  </a>
                </>
              )}
            </p>
          </div>
          <div className="card part3-research-card">
            <h3>How we identified this segment</h3>
            <p>{frame.segment.researchBasis}</p>
            <p className="part3-north-star">
              <strong>North-star:</strong> {frame.northStar}
            </p>
          </div>
        </div>
      </section>

      <section className="part1-section">
        <h2>Root cause</h2>
        <p className="part1-section-lead">
          <strong>{frame.rootCause.headline}</strong> {frame.rootCause.subhead}
        </p>
        <div className="part1-pillar-grid">
          {frame.rootCause.barriers.map((b) => (
            <div key={b.id} className="card part1-pillar-card">
              <h3>{b.title}</h3>
              <p className="part1-pillar-sub">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="part1-section">
        <h2>Existing user workarounds</h2>
        <div className="part1-validation-table-wrap card">
          <table className="part1-validation-table part3-table">
            <thead>
              <tr>
                <th>What users do</th>
                <th>Why it persists</th>
              </tr>
            </thead>
            <tbody>
              {frame.workarounds.map((w) => (
                <tr key={w.behavior}>
                  <td>{w.behavior}</td>
                  <td>{w.whyItPersists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="part1-section">
        <h2>What users need before trying something new</h2>
        <div className="part1-validation-table-wrap card">
          <table className="part1-validation-table part3-table">
            <thead>
              <tr>
                <th>Need</th>
                <th>MVP response</th>
              </tr>
            </thead>
            <tbody>
              {frame.userNeeds.map((n) => (
                <tr key={n.need}>
                  <td>{n.need}</td>
                  <td>{n.mvpResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="part1-section">
        <h2>Why solving this creates value</h2>
        <div className="part3-value-grid">
          <div className="card part3-value-card">
            <h3>User value</h3>
            <ul>
              {frame.userValue.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
          <div className="card part3-value-card">
            <h3>Business value (2-quarter targets)</h3>
            <ul className="part3-metric-list">
              {frame.businessValue.map((m) => (
                <li key={m.label}>
                  <span className="part3-metric-target">{m.target}</span>
                  <span className="part3-metric-label">{m.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="part1-section">
        <h2>AI discovery vs primary research</h2>
        <p className="part1-section-lead">
          How scraped insights and interviews aligned — and what changed our MVP design.
        </p>

        <div className="part3-reconcile-grid">
          <div className="card part3-reconcile-card part3-reconcile-confirmed">
            <h3>What AI got right</h3>
            <ul>
              {frame.reconciliation.aiConfirmed.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="card part3-reconcile-card part3-reconcile-added">
            <h3>What interviews added</h3>
            <ul>
              {frame.reconciliation.researchAdded.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="card part3-reconcile-card part3-reconcile-new">
            <h3>New insight (research only)</h3>
            <ul>
              {frame.reconciliation.researchOnly.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="part1-validation-table-wrap card" style={{ marginTop: "1rem" }}>
          <h3 className="part3-table-title">Theme validation matrix</h3>
          <table className="part1-validation-table part3-table">
            <thead>
              <tr>
                <th>Theme</th>
                <th>Confirmed</th>
                <th>Challenged</th>
                <th>New nuance</th>
              </tr>
            </thead>
            <tbody>
              {frame.validationMatrix.map((row) => (
                <tr key={row.themeId}>
                  <td>{row.theme}</td>
                  <td className="part1-pass">{row.confirmed}</td>
                  <td>{row.challenged === "0" ? "—" : row.challenged}</td>
                  <td>{row.newInsight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {themes && themes.length > 0 && (
          <div className="part3-scraped-evidence">
            <h3 className="part3-table-title">Scraped evidence behind each theme</h3>
            <p className="part1-section-lead">
              Verbatim quotes from app stores, Reddit, forums, and reviews — with links to
              original sources.
            </p>
            <div className="part3-evidence-grid">
              {frame.validationMatrix.map((row) => {
                const theme = themes.find((t) => t.id === row.themeId);
                if (!theme?.quotes?.length) return null;
                return (
                  <div key={row.themeId} className="card part3-theme-evidence">
                    <h4>{theme.label}</h4>
                    <p className="part3-theme-evidence-meta">
                      {theme.frequency} signals · {theme.confidence} confidence
                    </p>
                    {theme.quotes.map((q) => (
                      <ScrapedQuoteCard key={q.reviewId} quote={q} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
