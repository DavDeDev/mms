import { Footer } from "@/components/footer";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { TopNavigator } from "@/components/top-nav";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Next.js and Supabase Starter Kit",
	description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={GeistSans.className} suppressHydrationWarning>
			<body className="bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main className="min-h-screen flex flex-col items-center">
						<div className="flex-1 w-full flex flex-col items-center">
							<TopNavigator />
							<div className="flex flex-col">{children}</div>

							<Footer />
						</div>
					</main>
					<Toaster richColors position="top-right" />
					<TailwindIndicator />
				</ThemeProvider>
			</body>
		</html>
	);
}
