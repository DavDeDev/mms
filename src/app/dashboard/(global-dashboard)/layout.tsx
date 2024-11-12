import { GlobalDashboardSidebar } from "@/components/global-dashboard-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider defaultOpen={true}>
			<GlobalDashboardSidebar />
			<SidebarInset>
				<header className="md:hidden flex h-16 shrink-0 items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
				</header>
				<div className="container my-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
