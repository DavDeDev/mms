export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cohort: {
        Row: {
          duration: unknown
          id: number
          name: string | null
          semester: Database["public"]["Enums"]["college_semesters"]
          year: number
        }
        Insert: {
          duration: unknown
          id?: never
          name?: string | null
          semester: Database["public"]["Enums"]["college_semesters"]
          year: number
        }
        Update: {
          duration?: unknown
          id?: never
          name?: string | null
          semester?: Database["public"]["Enums"]["college_semesters"]
          year?: number
        }
        Relationships: []
      }
      cohort_mentee: {
        Row: {
          cohort_id: number
          id: number
          mentee_id: number
        }
        Insert: {
          cohort_id: number
          id?: never
          mentee_id: number
        }
        Update: {
          cohort_id?: number
          id?: never
          mentee_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cohort_mentee_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohort_mentees_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohort"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_mentor: {
        Row: {
          cohort_id: number
          id: number
          mentor_id: number
        }
        Insert: {
          cohort_id: number
          id?: never
          mentor_id: number
        }
        Update: {
          cohort_id?: number
          id?: never
          mentor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cohort_mentor_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohort_mentors_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohort"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_availability: {
        Row: {
          cohort_mentor_id: number | null
          day_of_week: string | null
          end_time: string | null
          id: number
          start_time: string | null
        }
        Insert: {
          cohort_mentor_id?: number | null
          day_of_week?: string | null
          end_time?: string | null
          id?: never
          start_time?: string | null
        }
        Update: {
          cohort_mentor_id?: number | null
          day_of_week?: string | null
          end_time?: string | null
          id?: never
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_availability_cohort_mentor_id_fkey"
            columns: ["cohort_mentor_id"]
            isOneToOne: false
            referencedRelation: "cohort_mentor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_availability_mentor_id_fkey"
            columns: ["cohort_mentor_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_mentee_match: {
        Row: {
          cohort_mentee_id: number | null
          cohort_mentor_id: number | null
          id: number
        }
        Insert: {
          cohort_mentee_id?: number | null
          cohort_mentor_id?: number | null
          id?: never
        }
        Update: {
          cohort_mentee_id?: number | null
          cohort_mentor_id?: number | null
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "mentor_mentee_match_cohort_mentee_id_fkey"
            columns: ["cohort_mentee_id"]
            isOneToOne: false
            referencedRelation: "cohort_mentee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_mentee_match_cohort_mentor_id_fkey"
            columns: ["cohort_mentor_id"]
            isOneToOne: false
            referencedRelation: "cohort_mentor"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      session: {
        Row: {
          cohort_id: number | null
          duration: unknown | null
          id: number
          mentor_id: number | null
        }
        Insert: {
          cohort_id?: number | null
          duration?: unknown | null
          id?: never
          mentor_id?: number | null
        }
        Update: {
          cohort_id?: number | null
          duration?: unknown | null
          id?: never
          mentor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohort"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "cohort_mentor"
            referencedColumns: ["id"]
          },
        ]
      }
      session_attendee: {
        Row: {
          id: number
          mentee_id: number | null
          session_id: number | null
        }
        Insert: {
          id?: never
          mentee_id?: number | null
          session_id?: number | null
        }
        Update: {
          id?: never
          mentee_id?: number | null
          session_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_attendees_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "cohort_mentee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_attendees_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "session"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          bio: string | null
          campus: Database["public"]["Enums"]["college_campuses"]
          country_of_origin: string | null
          created_at: string
          id: number
          interests: string[] | null
          is_international: boolean | null
          program_of_study: string | null
          role: Database["public"]["Enums"]["app_role"]
          student_id: number | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          campus: Database["public"]["Enums"]["college_campuses"]
          country_of_origin?: string | null
          created_at?: string
          id?: number
          interests?: string[] | null
          is_international?: boolean | null
          program_of_study?: string | null
          role: Database["public"]["Enums"]["app_role"]
          student_id?: number | null
          user_id: string
        }
        Update: {
          bio?: string | null
          campus?: Database["public"]["Enums"]["college_campuses"]
          country_of_origin?: string | null
          created_at?: string
          id?: number
          interests?: string[] | null
          is_international?: boolean | null
          program_of_study?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          student_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
    }
    Enums: {
      app_permission: "cohorts.delete" | "cohorts.create" | "cohort.modify"
      app_role: "admin" | "mentor" | "mentee"
      college_campuses:
        | "Progress"
        | "Morningside"
        | "Downsview"
        | "Ashtonbee"
        | "Story Arts Centre"
      college_semesters: "fall" | "winter" | "summer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

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
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

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
    : never
