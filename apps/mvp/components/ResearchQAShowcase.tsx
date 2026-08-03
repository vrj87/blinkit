"use client";

import { useMemo, useState } from "react";
import {
  RESEARCH_QUESTIONS,
  buildQuestionView,
  type EvidenceQuote,
  type ThemeData,
} from "@/lib/research-questions";
import type { SurveyEvidenceFile } from "@/lib/survey-evidence";
import { formatSourceLabel, isValidSourceUrl } from "@/lib/source-labels";

type QuestionView = ReturnType<typeof buildQuestionView>;

export function ResearchQAShowcase({
  themes,
  survey,
  scrapedTotal,
  audience = "internal",
}: {
  themes: ThemeData[];
  survey: SurveyEvidenceFile | null;
  scrapedTotal?: number;
  /** reviewer = hide pipeline jargon for stakeholder-facing pages */
  audience?: "internal" | "reviewer";
}) {
  const simple = audience === "reviewer";
  const views = useMemo(
    () => RESEARCH_QUESTIONS.map((q) => buildQuestionView(q, themes, survey)),
    [themes, survey]
  );

  const [expanded, setExpanded] = useState<string | null>(views[0]?.id ?? null);
  const [compareA, setCompareA] = useState<string>(views[0]?.id ?? "");
  const [compareB, setCompareB] = useState<string>(views[1]?.id ?? "");
  const [mode, setMode] = useState<"browse" | "compare">("browse");

  const viewA = views.find((v) => v.id === compareA);
  const viewB = views.find((v) => v.id === compareB);

  const surveyN = survey?.meta.n ?? 0;

  return (
    <section className="qa-showcase">
      <div className="qa-toolbar">
        <div>
          <h2>{simple ? "Key questions & insights" : "Research questions & answers"}</h2>
          {!simple && (
            <p className="qa-evidence-summary">
              {scrapedTotal ?? "—"} scraped signals · {surveyN} survey responses · dual-source
              evidence
            </p>
          )}
        </div>
        {!simple && (
          <div className="qa-mode-toggle">
            <button
              type="button"
              className={`btn ${mode === "browse" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setMode("browse")}
            >
              Browse
            </button>
            <button
              type="button"
              className={`btn ${mode === "compare" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setMode("compare")}
            >
              Compare
            </button>
          </div>
        )}
      </div>

      {mode === "browse" || simple ? (
        <div className="qa-list">
          {views.map((v, i) => (
            <QuestionCard
              key={v.id}
              view={v}
              index={i + 1}
              open={expanded === v.id}
              onToggle={() => setExpanded(expanded === v.id ? null : v.id)}
              simple={simple}
            />
          ))}
        </div>
      ) : (
        <ComparePanel
          views={views}
          compareA={compareA}
          compareB={compareB}
          setCompareA={setCompareA}
          setCompareB={setCompareB}
          viewA={viewA}
          viewB={viewB}
        />
      )}
    </section>
  );
}

function QuoteBlock({ quote, simple = false }: { quote: EvidenceQuote; simple?: boolean }) {
  const isSurvey = quote.kind === "survey";
  return (
    <blockquote className="qa-quote">
      &ldquo;{quote.text.length > 280 ? `${quote.text.slice(0, 280)}…` : quote.text}&rdquo;
      <footer>
        {!simple && (
          <span className={`risk-tag ${isSurvey ? "qa-tag-survey" : "qa-tag-scraped"}`}>
            {isSurvey ? "survey" : "scraped"}
          </span>
        )}
        <SourceAttribution quote={quote} simple={simple} />
        {!simple && !isSurvey && (
          <span className="qa-theme-ref">{quote.themeLabel}</span>
        )}
        {!simple && isSurvey && (
          <span className="qa-theme-ref">
            {quote.field} · {quote.app}
          </span>
        )}
      </footer>
    </blockquote>
  );
}

function SourceAttribution({ quote, simple }: { quote: EvidenceQuote; simple: boolean }) {
  if (quote.kind === "survey") {
    const label = simple ? `Survey · ${quote.app}` : "Primary survey";
    if (quote.surveyUrl) {
      return (
        <a
          href={quote.surveyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="qa-source-link"
        >
          {label} ↗
        </a>
      );
    }
    return <span className="risk-tag">{label}</span>;
  }

  const label = formatSourceLabel(quote.source);
  if (isValidSourceUrl(quote.url)) {
    return (
      <a
        href={quote.url}
        target="_blank"
        rel="noopener noreferrer"
        className="qa-source-link"
        title={quote.url}
      >
        {label} ↗
      </a>
    );
  }

  return <span className="risk-tag">{label}</span>;
}

function ScrapedSourceList({ quotes }: { quotes: Extract<EvidenceQuote, { kind: "scraped" }>[] }) {
  const bySource = new Map<string, string>();
  for (const q of quotes) {
    if (!bySource.has(q.source) && isValidSourceUrl(q.url)) {
      bySource.set(q.source, q.url);
    }
  }
  if (bySource.size === 0) return null;

  return (
    <div className="qa-scraped-sources">
      {Array.from(bySource.entries()).map(([source, url]) => (
        <a
          key={source}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="qa-source-chip"
        >
          {formatSourceLabel(source)} ↗
        </a>
      ))}
    </div>
  );
}

function QuestionCard({
  view,
  index,
  open,
  onToggle,
  simple = false,
}: {
  view: QuestionView;
  index: number;
  open: boolean;
  onToggle: () => void;
  simple?: boolean;
}) {
  return (
    <article className={`qa-card ${open ? "qa-card-open" : ""}`}>
      <button type="button" className="qa-card-header" onClick={onToggle}>
        <span className="qa-num">Q{index}</span>
        <div className="qa-card-title">
          <h3>{view.question}</h3>
          {!open && <p className="qa-preview">{view.shortAnswer}</p>}
        </div>
        <div className="qa-meta">
          {!simple && (
            <>
              <span className={`badge badge-${view.confidence === "high" ? "accepted" : "pending"}`}>
                {view.confidence}
              </span>
              <span className="qa-freq">
                {view.scrapedFrequency} scraped · {view.surveyQuotes.length} survey
              </span>
            </>
          )}
          <span className="qa-chevron">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="qa-card-body">
          <div className="qa-answer-block">
            <h4>Answer</h4>
            <p>{view.shortAnswer}</p>
          </div>

          {view.surveyStats.length > 0 && (
            <div className="qa-survey-stats-block">
              <h4>{simple ? "What users told us" : `Survey findings (n=${view.surveyCount})`}</h4>
              <ul className="qa-survey-stats">
                {view.surveyStats.map((s) => (
                  <li key={s.label}>
                    <span className="qa-stat-pct">{s.pct}%</span>
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!simple && (
            <div className="qa-themes-block">
              <h4>Linked themes — scraped analysis ({view.themes.length})</h4>
              <div className="qa-theme-chips">
                {view.themes.map((t) => (
                  <span key={t.id} className="risk-tag">
                    {t.label} · {t.frequency}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!simple && (
            <div className="qa-sources-block">
              <h4>Evidence sources</h4>
              <p>{view.sources.map((s) => formatSourceLabel(s)).join(" · ") || "—"}</p>
              <ScrapedSourceList quotes={view.scrapedQuotes} />
            </div>
          )}

          {simple && view.scrapedQuotes.length > 0 && (
            <div className="qa-sources-block qa-sources-block-simple">
              <h4>Sources</h4>
              <ScrapedSourceList quotes={view.scrapedQuotes} />
            </div>
          )}

          {view.actions.length > 0 && (
            <div className="qa-actions-block">
              <h4>{simple ? "What this means for Blinkit" : "Recommended actions"}</h4>
              <ul>
                {view.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {view.surveyQuotes.length > 0 && (
            <div className="qa-quotes-block">
              <h4>{simple ? "In their words — survey" : "Survey responses"}</h4>
              {view.surveyQuotes.map((q, i) => (
                <QuoteBlock key={`s-${i}`} quote={q} simple={simple} />
              ))}
            </div>
          )}

          {view.scrapedQuotes.length > 0 && (
            <div className="qa-quotes-block">
              <h4>{simple ? "In their words — reviews & social" : "Scraped reviews & social"}</h4>
              {view.scrapedQuotes.map((q, i) => (
                <QuoteBlock key={`r-${i}`} quote={q} simple={simple} />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ComparePanel({
  views,
  compareA,
  compareB,
  setCompareA,
  setCompareB,
  viewA,
  viewB,
}: {
  views: QuestionView[];
  compareA: string;
  compareB: string;
  setCompareA: (id: string) => void;
  setCompareB: (id: string) => void;
  viewA?: QuestionView;
  viewB?: QuestionView;
}) {
  return (
    <>
      <div className="qa-compare-select">
        <label>
          Question A
          <select value={compareA} onChange={(e) => setCompareA(e.target.value)}>
            {views.map((v, i) => (
              <option key={v.id} value={v.id}>
                Q{i + 1}: {v.question.slice(0, 50)}…
              </option>
            ))}
          </select>
        </label>
        <label>
          Question B
          <select value={compareB} onChange={(e) => setCompareB(e.target.value)}>
            {views.map((v, i) => (
              <option key={v.id} value={v.id}>
                Q{i + 1}: {v.question.slice(0, 50)}…
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="qa-compare-grid">
        {viewA && <CompareColumn view={viewA} label="A" />}
        {viewB && <CompareColumn view={viewB} label="B" />}
      </div>

      {viewA && viewB && (
        <div className="card qa-compare-summary">
          <h4>Comparison summary</h4>
          <table className="qa-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Q{views.findIndex((v) => v.id === viewA.id) + 1}</th>
                <th>Q{views.findIndex((v) => v.id === viewB.id) + 1}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Scraped signals</td>
                <td>{viewA.scrapedFrequency}</td>
                <td>{viewB.scrapedFrequency}</td>
              </tr>
              <tr>
                <td>Survey quotes</td>
                <td>{viewA.surveyQuotes.length}</td>
                <td>{viewB.surveyQuotes.length}</td>
              </tr>
              <tr>
                <td>Survey stat points</td>
                <td>{viewA.surveyStats.length}</td>
                <td>{viewB.surveyStats.length}</td>
              </tr>
              <tr>
                <td>Themes linked</td>
                <td>{viewA.themes.length}</td>
                <td>{viewB.themes.length}</td>
              </tr>
              <tr>
                <td>Confidence</td>
                <td>{viewA.confidence}</td>
                <td>{viewB.confidence}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function CompareColumn({ view, label }: { view: QuestionView; label: string }) {
  return (
    <div className="qa-compare-col card">
      <span className="qa-compare-label">Question {label}</span>
      <h3>{view.question}</h3>
      <p className="qa-answer-block">{view.shortAnswer}</p>
      <div className="qa-stat-row">
        <div>
          <div className="stat-value">{view.scrapedFrequency}</div>
          <div className="stat-label">scraped</div>
        </div>
        <div>
          <div className="stat-value">{view.surveyQuotes.length}</div>
          <div className="stat-label">survey quotes</div>
        </div>
      </div>
      {view.surveyStats[0] && (
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
          Survey: {view.surveyStats[0].pct}% — {view.surveyStats[0].label}
        </p>
      )}
      <h4>Themes (scraped)</h4>
      <ul className="qa-compare-themes">
        {view.themes.map((t) => (
          <li key={t.id}>
            <strong>{t.label}</strong>
            <p>{t.summary}</p>
          </li>
        ))}
      </ul>
      {view.surveyQuotes[0] && <QuoteBlock quote={view.surveyQuotes[0]} />}
      {view.scrapedQuotes[0] && <QuoteBlock quote={view.scrapedQuotes[0]} />}
    </div>
  );
}
