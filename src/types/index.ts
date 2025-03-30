export interface User {
  id: string;
  email: string;
  role: 'mentor' | 'mentee';
  profileId: string;
  full_name?: string;
}

export interface Session {
  id: string;
  mentee: {
    id: string;
    full_name: string;
    display_name: string;
  };
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Mentor {
  id: string;
  user_id: string;
  role: string;
  expertise?: string;
  years_of_experience?: number;
  full_name?: string;
  email?: string;
}

export interface Availability {
  id: string;
  mentor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    full_name: string | null;
    display_name: string | null;
  };
}

export interface ProgressUpdate {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    display_name: string | null;
  };
  type: 'message' | 'resource' | 'completion';
  completion_comment?: string | null;
}

export interface SessionResource {
  id: string;
  title: string;
  url: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  description: string | null;
  created_at: string;
  author_id: string;
  completed: boolean;
  completed_at: string | null;
  completion_comment: string | null;
}