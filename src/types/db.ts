export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			cohort_members: {
				Row: {
					cohort_id: number;
					id: number;
					joined_at: string | null;
					role: Database["public"]["Enums"]["cohort_role"];
					user_id: string;
				};
				Insert: {
					cohort_id: number;
					id?: number;
					joined_at?: string | null;
					role: Database["public"]["Enums"]["cohort_role"];
					user_id: string;
				};
				Update: {
					cohort_id?: number;
					id?: number;
					joined_at?: string | null;
					role?: Database["public"]["Enums"]["cohort_role"];
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "cohort_member_cohort_id_fkey1";
						columns: ["cohort_id"];
						isOneToOne: false;
						referencedRelation: "cohorts";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "cohort_members_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			cohorts: {
				Row: {
					avatar_url: string | null;
					created_at: string;
					end_date: string;
					id: number;
					semester: Database["public"]["Enums"]["college_semesters"];
					start_date: string;
					year: number;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string;
					end_date: string;
					id?: number;
					semester: Database["public"]["Enums"]["college_semesters"];
					start_date: string;
					year: number;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string;
					end_date?: string;
					id?: number;
					semester?: Database["public"]["Enums"]["college_semesters"];
					start_date?: string;
					year?: number;
				};
				Relationships: [];
			};
			mentor_availability: {
				Row: {
					cohort_mentor_id: number | null;
					day_of_week: Database["public"]["Enums"]["day_of_week"] | null;
					end_time: string | null;
					id: number;
					start_time: string | null;
				};
				Insert: {
					cohort_mentor_id?: number | null;
					day_of_week?: Database["public"]["Enums"]["day_of_week"] | null;
					end_time?: string | null;
					id?: never;
					start_time?: string | null;
				};
				Update: {
					cohort_mentor_id?: number | null;
					day_of_week?: Database["public"]["Enums"]["day_of_week"] | null;
					end_time?: string | null;
					id?: never;
					start_time?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "mentor_availability_cohort_mentor_id_fkey";
						columns: ["cohort_mentor_id"];
						isOneToOne: false;
						referencedRelation: "cohort_members";
						referencedColumns: ["id"];
					},
				];
			};
			mentor_mentee_matches: {
				Row: {
					id: number;
					mentee_cohort_member_id: number | null;
					mentor_cohort_member_id: number | null;
					status: Database["public"]["Enums"]["match_status"];
				};
				Insert: {
					id?: never;
					mentee_cohort_member_id?: number | null;
					mentor_cohort_member_id?: number | null;
					status?: Database["public"]["Enums"]["match_status"];
				};
				Update: {
					id?: never;
					mentee_cohort_member_id?: number | null;
					mentor_cohort_member_id?: number | null;
					status?: Database["public"]["Enums"]["match_status"];
				};
				Relationships: [
					{
						foreignKeyName: "mentor_mentee_match_mentee_cohort_member_id_fkey";
						columns: ["mentee_cohort_member_id"];
						isOneToOne: false;
						referencedRelation: "cohort_members";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "mentor_mentee_match_mentor_cohort_member_id_fkey";
						columns: ["mentor_cohort_member_id"];
						isOneToOne: false;
						referencedRelation: "cohort_members";
						referencedColumns: ["id"];
					},
				];
			};
			role_permissions: {
				Row: {
					id: number;
					permission: Database["public"]["Enums"]["app_permission"];
					role: Database["public"]["Enums"]["cohort_role"];
				};
				Insert: {
					id?: number;
					permission: Database["public"]["Enums"]["app_permission"];
					role: Database["public"]["Enums"]["cohort_role"];
				};
				Update: {
					id?: number;
					permission?: Database["public"]["Enums"]["app_permission"];
					role?: Database["public"]["Enums"]["cohort_role"];
				};
				Relationships: [];
			};
			session_attendees: {
				Row: {
					id: number;
					mentee_cohort_id: number | null;
					session_id: number | null;
				};
				Insert: {
					id?: never;
					mentee_cohort_id?: number | null;
					session_id?: number | null;
				};
				Update: {
					id?: never;
					mentee_cohort_id?: number | null;
					session_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "session_attendees_mentee_cohort_id_fkey";
						columns: ["mentee_cohort_id"];
						isOneToOne: false;
						referencedRelation: "cohort_members";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "session_attendees_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "sessions";
						referencedColumns: ["id"];
					},
				];
			};
			sessions: {
				Row: {
					created_at: string;
					date: string | null;
					id: number;
					mentor_cohort_member_id: number | null;
					topic: string | null;
				};
				Insert: {
					created_at?: string;
					date?: string | null;
					id?: number;
					mentor_cohort_member_id?: number | null;
					topic?: string | null;
				};
				Update: {
					created_at?: string;
					date?: string | null;
					id?: number;
					mentor_cohort_member_id?: number | null;
					topic?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "sessions_mentor_cohort_member_id_fkey";
						columns: ["mentor_cohort_member_id"];
						isOneToOne: false;
						referencedRelation: "cohort_members";
						referencedColumns: ["id"];
					},
				];
			};
			users: {
				Row: {
					avatar_url: string | null;
					bio: string | null;
					campus: Database["public"]["Enums"]["college_campuses"] | null;
					country_of_origin: string | null;
					created_at: string | null;
					dob: string | null;
					email: string;
					first_name: string | null;
					id: string;
					interests: string[] | null;
					is_international: boolean | null;
					last_name: string | null;
					phone_number: string | null;
					program_of_study: string | null;
					role: Database["public"]["Enums"]["app_role"];
					school_id: number | null;
					sex: Database["public"]["Enums"]["user_sex"] | null;
				};
				Insert: {
					avatar_url?: string | null;
					bio?: string | null;
					campus?: Database["public"]["Enums"]["college_campuses"] | null;
					country_of_origin?: string | null;
					created_at?: string | null;
					dob?: string | null;
					email: string;
					first_name?: string | null;
					id: string;
					interests?: string[] | null;
					is_international?: boolean | null;
					last_name?: string | null;
					phone_number?: string | null;
					program_of_study?: string | null;
					role?: Database["public"]["Enums"]["app_role"];
					school_id?: number | null;
					sex?: Database["public"]["Enums"]["user_sex"] | null;
				};
				Update: {
					avatar_url?: string | null;
					bio?: string | null;
					campus?: Database["public"]["Enums"]["college_campuses"] | null;
					country_of_origin?: string | null;
					created_at?: string | null;
					dob?: string | null;
					email?: string;
					first_name?: string | null;
					id?: string;
					interests?: string[] | null;
					is_international?: boolean | null;
					last_name?: string | null;
					phone_number?: string | null;
					program_of_study?: string | null;
					role?: Database["public"]["Enums"]["app_role"];
					school_id?: number | null;
					sex?: Database["public"]["Enums"]["user_sex"] | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			authorize: {
				Args: {
					requested_permission: Database["public"]["Enums"]["app_permission"];
				};
				Returns: boolean;
			};
			custom_access_token_hook: {
				Args: {
					event: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			app_permission: "cohorts.delete" | "cohorts.create" | "cohort.modify";
			app_role: "admin" | "user";
			cohort_role: "admin" | "mentor" | "mentee" | "coordinator";
			college_campuses:
				| "Progress"
				| "Morningside"
				| "Downsview"
				| "Ashtonbee"
				| "Story Arts Centre";
			college_semesters: "fall" | "winter" | "summer";
			day_of_week:
				| "monday"
				| "tuesday"
				| "wednesday"
				| "thursday"
				| "friday"
				| "saturday"
				| "sunday";
			match_status: "pending" | "confirmed" | "cancelled";
			user_sex: "male" | "female" | "other";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
				PublicSchema["Views"])
		? (PublicSchema["Tables"] &
				PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
		? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;
