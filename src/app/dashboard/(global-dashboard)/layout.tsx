import { GlobalDashboardSidebar } from "@/components/global-dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider defaultOpen={true}>
			<GlobalDashboardSidebar />
			<SidebarInset>
				<div className="container my-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
