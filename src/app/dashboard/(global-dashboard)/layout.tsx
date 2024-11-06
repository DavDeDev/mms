import { GlobalDashboardSidebar } from "@/components/global-dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return(
    <SidebarProvider>
      <GlobalDashboardSidebar/>
      {children}
      </SidebarProvider>
  );
}
