import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/db";

export type Client = SupabaseClient<Database>;

export type ServerActionResponse<T> = {
	success: boolean;
	data?: T;
	error?: string;
};

export * from "./db";
