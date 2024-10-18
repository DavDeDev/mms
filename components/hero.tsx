import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
	return (
		<section className="w-full py-6 md:py-12 lg:py-16 xl:py-24">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center space-y-4 text-center">
					<Badge variant="secondary" className="mb-2">
						Beta
					</Badge>
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
							Empower Your School's <br />
							<span className="text-brand">Mentorship Program</span>
						</h1>
						<p className="mx-auto max-w-[650px] text-gray-500 md:text-xl dark:text-gray-400">
							MMS helps schools effortlessly manage and scale their mentorship
							programs, fostering growth and success for every student.
						</p>
					</div>
					<div className="space-x-4">
						<Button asChild>
							<Link href="/cohorts">View your Cohorts</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/contact/sales">Request a Demo</Link>
						</Button>
					</div>
					{/* TODO: Insert Marquee */}
				</div>
			</div>
		</section>
	);
}
