import { GlobalDashboardSidebar } from "@/components/global-dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<GlobalDashboardSidebar />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
