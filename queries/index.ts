import { Client } from "../types";



export async function getUserQuery(supabase: Client, userId: string) {
  return supabase
    .from("user_profile")
    .select("*")
    .eq("user_id", userId)
    .single()
    .throwOnError();
}


export async function getCohorts(supabase: Client, userId: string) {
  console.log("USER ID", userId)
  return supabase
    .from('cohort')
    .select(`
      *,
      cohort_mentor(
      *
      ),
      cohort_mentee(
      *
      )
    `)
    // .select('*')
    .eq('user_id::text', userId)
    .throwOnError();
}

