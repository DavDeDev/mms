/**
 * MenteeDashboard component displays the main dashboard for mentee users.
 * Provides access to mentors, sessions, and learning resources.
 * 
 * Features:
 * - Browse and connect with available mentors
 * - View and manage mentoring sessions
 * - Track learning progress
 * - Access educational resources
 * - Real-time session updates
 * 
 * State Management:
 * - Manages mentor list and filtering
 * - Handles session scheduling and updates
 * - Tracks loading and error states
 * - Maintains real-time subscriptions
 */
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfDay, parse } from 'date-fns';
import { Calendar, Clock, Users, MessageSquare, Target, Book, Award, Rocket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { MentorSchedule } from './MentorSchedule';
import { SessionThread } from './SessionThread';
import { toast } from 'sonner';

interface Mentor {
  id: string;
  user_id: string;
  role: string;
  expertise?: string;
  years_of_experience?: number;
  full_name?: string;
  email?: string;
}

interface Session {
  id: string;
  mentor_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  mentor: {
    id: string;
    full_name: string | null;
  };
}

export function MenteeDashboard() {
  // State management for mentors and sessions
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const { user } = useAuthStore();

  /**
   * Fetches available mentors and session data on component mount.
   * Sets up real-time subscriptions for session updates.
   */
  useEffect(() => {
    async function fetchMentors() {
      if (!user?.profileId) return;

      try {
        setLoading(true);
        setError(null);

        const { data: mentorProfiles, error: mentorError } = await supabase
          .from('profiles')
          .select(`
            *,
            email:user_emails(email)
          `)
          .eq('role', 'mentor')
          .neq('id', user.profileId);

        if (mentorError) throw mentorError;
        if (!mentorProfiles) throw new Error('No mentor data received');

        const mentorsWithEmail = mentorProfiles.map(mentor => ({
          ...mentor,
          email: mentor.email?.[0]?.email
        }));

        setMentors(mentorsWithEmail);
      } catch (err) {
        console.error('Error fetching mentors:', err);
        setError('Failed to load mentors. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    async function fetchSessions() {
      if (!user?.profileId) return;
      
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select(`
            *,
            mentor:mentor_id (
              id,
              full_name
            )
          `)
          .eq('mentee_id', user.profileId)
          .order('start_time', { ascending: true });

        if (error) throw error;
        setSessions(data || []);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      }
    }

    if (user?.role === 'mentee') {
      fetchMentors();
    }
    fetchSessions();

    const subscription = supabase
      .channel('sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `mentee_id=eq.${user?.profileId}`
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.profileId, user?.role]);

  /**
   * Handles scheduling a new session with a mentor.
   * Creates session record and notifies users of success/failure.
   * 
   * @param dayOfWeek - Day of the week for the session (0-6)
   * @param startTime - Session start time
   * @param endTime - Session end time
   */
  const handleScheduleSession = async (dayOfWeek: number, startTime: string, endTime: string) => {
    if (!user?.profileId || !selectedMentor) return;

    try {
      const today = new Date();
      const daysUntilNext = (dayOfWeek - today.getDay() + 7) % 7;
      const nextOccurrence = addDays(startOfDay(today), daysUntilNext);

      const startDateTime = parse(startTime, 'HH:mm:ss', nextOccurrence);
      const endDateTime = parse(endTime, 'HH:mm:ss', nextOccurrence);

      console.log('Creating session with:', {
        mentor_id: selectedMentor.id,
        mentee_id: user.profileId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString()
      });

      const { error } = await supabase
        .from('sessions')
        .insert([
          {
            mentor_id: selectedMentor.id,
            mentee_id: user.profileId,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      toast.success('Session scheduled successfully!', {
        description: 'Waiting for mentor confirmation.'
      });

      const { data: newSessions, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          *,
          mentor:mentor_id (
            id,
            full_name
          )
        `)
        .eq('mentee_id', user.profileId)
        .order('start_time', { ascending: true });

      if (sessionsError) throw sessionsError;
      setSessions(newSessions || []);
      setSelectedMentor(null);
    } catch (err) {
      console.error('Error scheduling session:', err);
      setError((err as Error).message);
      toast.error('Failed to schedule session');
    }
  };

  /**
   * Gets the display name for a mentor.
   * Falls back to email or ID if name is not available.
   * 
   * @param mentor - Mentor object
   * @returns Formatted display name
   */
  const getMentorDisplayName = (mentor: Mentor) => {
    return mentor.full_name || mentor.email || `Mentor #${mentor.id.slice(0, 8)}`;
  };

  /**
   * Gets the CSS classes for a session status badge.
   * 
   * @param status - Session status
   * @returns CSS class string
   */
  const getStatusBadgeClass = (status: Session['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.full_name || 'Mentee'}
        </h1>
        <p className="text-gray-300">
          Track your progress and connect with mentors to achieve your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold">Find Mentor</h3>
          </div>
          <p className="mt-2 text-gray-600">Browse available mentors</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold">My Goals</h3>
          </div>
          <p className="mt-2 text-gray-600">Track your objectives</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
          <div className="flex items-center">
            <Book className="h-8 w-8 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold">Resources</h3>
          </div>
          <p className="mt-2 text-gray-600">Access learning materials</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold">Progress</h3>
          </div>
          <p className="mt-2 text-gray-600">View your achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {sessions.filter(s => s.status === 'pending' || s.status === 'confirmed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-500 hover:text-orange-600">
                View schedule
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {sessions.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-500 hover:text-orange-600">
                View history
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Mentors
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mentors.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-500 hover:text-orange-600">
                Browse mentors
              </a>
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'mentee' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Available Mentors
            </h3>
            <div className="mt-4 space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading mentors...</div>
              ) : error ? (
                <div className="text-center text-red-600 py-4">{error}</div>
              ) : mentors.length === 0 ? (
                <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg">
                  No mentors are currently available. Please check back later.
                </div>
              ) : (
                mentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getMentorDisplayName(mentor)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {mentor.bio || 'No bio available'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {mentor.expertise || 'General Mentorship'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                    >
                      View Schedule
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Sessions
          </h3>
          <div className="mt-4 space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      Session with {session.mentor.full_name || 'Unknown Mentor'}
                    </p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(session.start_time), 'PPp')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {session.status === 'confirmed' && (
                    <>
                      <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 transition-colors">
                        Join Session
                      </button>
                      <button
                        onClick={() => setSelectedSession(session.id)}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        View Thread
                      </button>
                    </>
                  )}
                  {session.status === 'pending' && (
                    <span className="text-sm text-gray-500">
                      Awaiting mentor confirmation
                    </span>
                  )}
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg">
                You don't have any sessions scheduled yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedMentor && (
        <MentorSchedule
          mentorId={selectedMentor.id}
          mentorName={getMentorDisplayName(selectedMentor)}
          onClose={() => setSelectedMentor(null)}
          onScheduleSession={handleScheduleSession}
        />
      )}

      {selectedSession && (
        <SessionThread
          sessionId={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}