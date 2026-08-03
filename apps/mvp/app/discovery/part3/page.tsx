import { readFileSync } from "fs";
import { themesPath } from "@blinkit/discovery-core";
import { ProblemDefinitionShowcase } from "@/components/ProblemDefinitionShowcase";

export const dynamic = "force-dynamic";

function loadThemes() {
  try {
    const themes = JSON.parse(readFileSync(themesPath(), "utf-8"));
    return themes.themes;
  } catch {
    return undefined;
  }
}

export default function ProblemDefinitionPage() {
  const themes = loadThemes();

  return (
    <main className="container container-wide">
      <ProblemDefinitionShowcase themes={themes} />
    </main>
  );
}
