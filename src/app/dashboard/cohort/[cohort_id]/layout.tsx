import { checkUserAccess } from "@/actions/auth-actions";
import { CohortDashboardSidebar } from "@/components/cohort-dashboard-sidebar";
import { UserCohortRole } from "@/components/development/user-cohort-role-indicator";
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

export default async function CohortDashboardLayout(props: {
	children: React.ReactNode;
	params: Promise<{ cohort_id: string }>;
}) {
	const params = await props.params;

	const { children } = props;

	const cohortId = Number.parseInt(params.cohort_id);

	if (Number.isNaN(cohortId)) {
		redirect("/dashboard");
	}

	const result = await checkUserAccess(cohortId);

	if (!result.hasAccess) {
		redirect(result.redirectPath);
	}

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

	const userRole = result.userRole;
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<CohortDashboardSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Building Your Application {userRole}
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
				{children}
			</SidebarInset>
			<UserCohortRole userRole={userRole} />
		</SidebarProvider>
	);
}
