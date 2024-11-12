import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { signOutAction } from "@/actions/auth-actions";
import { TailwindIndicator } from "@/components/development/tailwind-indicator";
import { Button } from "components/ui/button";
import { Toaster } from "components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Mentoship Management System",
	description: "Manage your Mentorhsip Program with ease.",
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
					{children}
					<Toaster richColors position="top-right" />
					<TailwindIndicator />
					<SignOutButton />
				</ThemeProvider>
			</body>
		</html>
	);
}

function SignOutButton() {
	// if (process.env.NODE_ENV === "production") return null;

	return (
		<form action={signOutAction} className="fixed bottom-1 right-1 z-50">
			<Button type="submit" variant="destructive">
				Sign out
			</Button>
		</form>
	);
}
