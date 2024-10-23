export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <main className="h-screen flex items-center">{children}</main>;
}
