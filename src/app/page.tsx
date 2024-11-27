import { CTA } from "components/cta";
import { Footer } from "components/footer";
import { Hero } from "components/hero";
import { Features } from "components/key-features";
import { Topbar } from "components/topbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar /> {/* Retain only the top navigation bar */}
      <main className="max-w-6xl mx-auto">
        <Hero /> {/* Hero component for main content */}
        <Features /> {/* Key Features section */}
        <CTA /> {/* Call-to-action section */}
      </main>
      <Footer /> {/* Footer section */}
    </div>
  );
}
