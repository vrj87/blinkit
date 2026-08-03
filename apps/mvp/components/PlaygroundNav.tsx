"use client";

/** Tab order follows the project journey: discover → define → build → measure */
const SECTIONS = [
  { href: "/mvp", label: "★ MVP", external: true, featured: true },
  { href: "#overview", label: "Overview" },
  { href: "#collect", label: "Collect" },
  { href: "#discovery", label: "Research insights" },
  { href: "#problem", label: "Problem definition" },
  { href: "#ops", label: "Ops dashboard" },
] as const;

export function PlaygroundNav() {
  return (
    <nav className="playground-nav" aria-label="Playground sections">
      {SECTIONS.map((s) => (
        <a
          key={s.href}
          href={s.href}
          className={"featured" in s && s.featured ? "playground-nav-featured" : undefined}
          {...("external" in s && s.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
