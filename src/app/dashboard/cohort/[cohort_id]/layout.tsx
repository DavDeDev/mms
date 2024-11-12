import { CohortDashboardSidebar } from "@/components/cohort-dashboard-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CohortDashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ cohort_id: string }>;
}) {
	let cohortId: number;

	try {
		cohortId = Number.parseInt((await params).cohort_id, 10);
		if (
			Number.isNaN(cohortId) ||
			cohortId.toString() !== (await params).cohort_id
		) {
			throw new Error("Invalid cohort_id");
		}
	} catch (error) {
		console.log("Invalid cohort_id, redirecting to dashboard");
		redirect("/dashboard");
	}

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<CohortDashboardSidebar cohortId={cohortId} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Building Your Application
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="container">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
