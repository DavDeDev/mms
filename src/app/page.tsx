import { CTA } from "components/cta";
import { Footer } from "components/footer";
import { Hero } from "components/hero";
import { Features } from "components/key-features";
import { Topbar } from "components/topbar";

export default function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Topbar />
			<main className="max-w-6xl mx-auto">
				<Hero />
				<Features />
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
