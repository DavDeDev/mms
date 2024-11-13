import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/db";

export type Client = SupabaseClient<Database>;

export type ServerActionResponse<T = undefined> =
	| {
			success: true;
			data?: T | null; // Allow `data` to be `T` or explicitly `null`
			// No `error` field here
	  }
	| {
			success: false;
			error: string; // `error` is required in failure case
			// data is not included here at all
	  };

export type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>;
};

export * from "./db";
