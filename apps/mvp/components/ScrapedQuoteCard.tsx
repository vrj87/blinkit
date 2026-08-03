import { formatSourceLabel, isValidSourceUrl } from "@/lib/source-labels";

export interface ScrapedQuoteData {
  reviewId: string;
  text: string;
  source: string;
  url: string;
}

export function ScrapedQuoteCard({ quote }: { quote: ScrapedQuoteData }) {
  const label = formatSourceLabel(quote.source);
  return (
    <blockquote className="qa-quote">
      &ldquo;{quote.text.length > 280 ? `${quote.text.slice(0, 280)}…` : quote.text}&rdquo;
      <footer>
        {isValidSourceUrl(quote.url) ? (
          <a
            href={quote.url}
            target="_blank"
            rel="noopener noreferrer"
            className="qa-source-link"
            title={quote.url}
          >
            {label} ↗
          </a>
        ) : (
          <span className="risk-tag">{label}</span>
        )}
      </footer>
    </blockquote>
  );
}
