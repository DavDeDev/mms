import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function CohortsGrid() {
  const { data: { session } } = await createClient().auth.getSession();
  let decodedPayload;
  if (session?.access_token) {
    const [header, payload, signature] = session.access_token.split('.');
    decodedPayload = JSON.parse(atob(payload));
    // console.log("Decoded JWT payload:", decodedPayload);
  } else {
    // console.log("No access token available");
  }
  // Check user's role from the jwt token
  // check user_role in the payload, if the user role is admin, show all the cohorts, if the user role is user, show only the cohorts that the user is part of
  if (decodedPayload.user_role === "admin") {
    // fetch all the cohorts
    const { data: cohorts, error } = await createClient().from('cohort').select('*');
    if (error) {
      console.error("Error fetching cohorts:", error);
    }
    console.log("Cohorts:", cohorts);
  } else {
    // fetch the cohorts that the user is part of
  }
	
	return(
		<div className="flex items-center gap-4">
			<h1>Cohorts</h1>
      <div>
        <Button>
          Add Cohort
        </Button>
      </div>  
		</div>
	)
}