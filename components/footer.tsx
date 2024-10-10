import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
	return (
		<footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
			<p>
				Powered by{" "}
				<a
					href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
					target="_blank"
					className="font-bold hover:underline"
					rel="noreferrer"
				>
					Supabase
				</a>
			</p>
			<ThemeSwitcher />
		</footer>
	);
}
