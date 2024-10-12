export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// TODO: Center forms
		<main className="h-screen flex items-center">{children}</main>
	);
}
