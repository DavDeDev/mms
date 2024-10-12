import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							Ready to Transform Your School's Mentorship Program?
						</h2>
						<p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
							Join the growing community of schools using MMS to nurture student
							growth and success.
						</p>
					</div>
					<Button asChild size="lg">
						<Link href="/contact/sales">Request a Demo</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
