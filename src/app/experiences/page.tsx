import { Suspense } from "react";
import { Explorer } from "@/components/experiences/Explorer";

export default function ExperiencesPage() {
  return <Suspense fallback={<section className="explorer-shell" aria-busy="true"><h1 className="page-title">Cargando experiencias…</h1></section>}><Explorer /></Suspense>;
}
