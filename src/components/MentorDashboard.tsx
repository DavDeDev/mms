/**
 * MentorDashboard component displays the main dashboard for mentor users.
 * Provides tools for managing mentoring sessions, availability, and mentee progress.
 * 
 * Features:
 * - Manage availability schedule
 * - View and confirm pending sessions
 * - Track mentee progress
 * - Access teaching resources
 * - Real-time session updates
 * 
 * State Management:
 * - Handles availability scheduling
 * - Manages session confirmations
 * - Tracks loading and error states
 * - Maintains real-time subscriptions
 */
import React, { useState, useEffect } from 'react';
import { format, isAfter, startOfWeek, addDays, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { Calendar, Clock, Users, CheckCircle, Plus, MessageSquare, Rocket, Book, Target, Award } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAvailabilityStore } from '../store/availabilityStore';
import { supabase } from '../lib/supabase';
import { SessionThread } from './SessionThread';
import { toast } from 'sonner';

interface Session {
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

export function MentorDashboard() {
  // State management for calendar and availability
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [error, setError] = useState<string | null>(null);
  
  // State management for sessions
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingSession, setConfirmingSession] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const {
    availabilities,
    loading: availabilitiesLoading,
    fetchAvailabilities,
    addAvailability,
    updateAvailability,
    deleteAvailability
  } = useAvailabilityStore();

  /**
   * Fetches mentor's availability slots on component mount.
   */
  useEffect(() => {
    if (user?.profileId) {
      fetchAvailabilities(user.profileId).catch(err => {
        setError(err.message);
      });
    }
  }, [user?.profileId, fetchAvailabilities]);

  /**
   * Fetches sessions and sets up real-time subscription.
   * Updates session list when changes occur.
   */
  useEffect(() => {
    async function fetchSessions() {
      if (!user?.profileId) return;

      try {
        setLoading(true);
        console.log('Fetching sessions for mentor:', user.profileId);
        
        // Get the start of today
        const today = startOfDay(new Date());
        
        const { data, error: sessionsError } = await supabase
          .from('sessions')
          .select(`
            id,
            start_time,
            end_time,
            status,
            mentee:mentee_id (
              id,
              full_name,
              display_name
            )
          `)
          .eq('mentor_id', user.profileId)
          .in('status', ['pending', 'confirmed'])
          .gte('start_time', today.toISOString())
          .order('start_time', { ascending: true });

        if (sessionsError) throw sessionsError;
        
        console.log('Fetched sessions:', data);
        setSessions(data || []);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();

    // Set up real-time subscription
    const subscription = supabase
      .channel('sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `mentor_id=eq.${user?.profileId}`
        },
        (payload) => {
          console.log('Received session update:', payload);
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.profileId]);

  /**
   * Handles confirming a pending session.
   * Updates session status and notifies users.
   * 
   * @param sessionId - ID of the session to confirm
   */
  const handleConfirmSession = async (sessionId: string) => {
    try {
      setConfirmingSession(sessionId);
      const { error } = await supabase
        .from('sessions')
        .update({ status: 'confirmed' })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'confirmed' }
          : session
      ));

      toast.success('Session confirmed successfully!');
    } catch (err) {
      console.error('Error confirming session:', err);
      setError((err as Error).message);
      toast.error('Failed to confirm session');
    } finally {
      setConfirmingSession(null);
    }
  };

  /**
   * Handles adding a new availability slot.
   * Validates input and creates availability record.
   * 
   * @param e - Form submission event
   */
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.profileId) return;
    
    try {
      await addAvailability({
        mentor_id: user.profileId,
        day_of_week: selectedDate.getDay(),
        start_time: newStartTime,
        end_time: newEndTime,
        is_recurring: true
      });
      
      setIsAddingSlot(false);
      setNewStartTime('09:00');
      setNewEndTime('10:00');
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  /**
   * Handles updating an existing availability slot.
   * 
   * @param e - Form submission event
   * @param id - ID of the slot to update
   */
  const handleUpdateSlot = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      await updateAvailability(id, {
        start_time: newStartTime,
        end_time: newEndTime
      });
      setEditingSlot(null);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  /**
   * Handles deleting an availability slot.
   * 
   * @param id - ID of the slot to delete
   */
  const handleDeleteSlot = async (id: string) => {
    try {
      await deleteAvailability(id);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  /**
   * Gets the display name for a mentee.
   * Falls back to display name or "Anonymous Mentee".
   * 
   * @param mentee - Mentee object
   * @returns Formatted display name
   */
  const getMenteeName = (mentee: Session['mentee']) => {
    return mentee.full_name || mentee.display_name || 'Anonymous Mentee';
  };

  /**
   * Gets upcoming sessions that are pending or confirmed.
   * 
   * @returns Array of upcoming sessions
   */
  const getUpcomingSessions = () => {
    return sessions.filter(session => 
      isAfter(new Date(session.start_time), new Date()) && 
      ['pending', 'confirmed'].includes(session.status)
    );
  };

  /**
   * Gets completed sessions.
   * 
   * @returns Array of completed sessions
   */
  const getCompletedSessions = () => {
    return sessions.filter(session => session.status === 'completed');
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

  /**
   * Gets an array of dates representing the current week.
   * 
   * @returns Array of dates
   */
  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays();

  const filteredAvailabilities = availabilities.filter(
    (slot) => slot.day_of_week === selectedDate.getDay()
  );

  const upcomingSessions = getUpcomingSessions();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.full_name || 'Mentor'}
        </h1>
        <p className="text-gray-300">
          You have {sessions.filter(s => s.status === 'pending').length} pending sessions and{' '}
          {sessions.filter(s => s.status === 'confirmed').length} upcoming sessions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold">Schedule Session</h3>
          </div>
          <p className="mt-2 text-gray-600">Create a new mentoring session</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold">Set Goals</h3>
          </div>
          <p className="mt-2 text-gray-600">Define mentorship objectives</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
          <div className="flex items-center">
            <Book className="h-8 w-8 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold">Resources</h3>
          </div>
          <p className="mt-2 text-gray-600">Access mentoring materials</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold">Progress</h3>
          </div>
          <p className="mt-2 text-gray-600">Track mentee development</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Slots
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {availabilities.length}
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
                    Upcoming Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {sessions.filter(s => s.status === 'confirmed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-500 hover:text-orange-600">
                View all sessions
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
                    Active Mentees
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {new Set(sessions.map(s => s.mentee.id)).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-500 hover:text-orange-600">
                View mentees
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {sessions.filter(s => s.status === 'completed').length}
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
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Availability Schedule
            </h3>
            {error && (
              <p className="text-sm text-red-600">
                Error: {error}
              </p>
            )}
          </div>

          {/* Calendar View */}
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {weekDays.map((date, index) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    p-4 text-center bg-white transition-all
                    ${isSameDay(date, selectedDate)
                      ? 'bg-orange-50 border-2 border-orange-500'
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-lg font-semibold ${
                    isSameDay(date, selectedDate) ? 'text-orange-500' : 'text-gray-900'
                  }`}>
                    {format(date, 'd')}
                  </div>
                  {availabilities.filter(slot => slot.day_of_week === date.getDay()).length > 0 && (
                    <div className="mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {availabilitiesLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <>
                {filteredAvailabilities.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {editingSlot === slot.id ? (
                      <form 
                        onSubmit={(e) => handleUpdateSlot(e, slot.id)}
                        className="flex items-center space-x-4 w-full"
                      >
                        <input
                          type="time"
                          value={newStartTime}
                          onChange={(e) => setNewStartTime(e.target.value)}
                          className="rounded-md border-gray-300"
                          required
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={newEndTime}
                          onChange={(e) => setNewEndTime(e.target.value)}
                          className="rounded-md border-gray-300"
                          required
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSlot(null)}
                            className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {slot.start_time} - {slot.end_time}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingSlot(slot.id);
                              setNewStartTime(slot.start_time);
                              setNewEndTime(slot.end_time);
                            }}
                            className="px-3 py-1 text-sm font-medium text-orange-500 hover:text-orange-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {isAddingSlot ? (
                  <form 
                    onSubmit={handleAddSlot}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="time"
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                        className="rounded-md border-gray-300"
                        required
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                        className="rounded-md border-gray-300"
                        required
                      />
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingSlot(false)}
                          className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingSlot(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Time Slot
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Upcoming Sessions
          </h3>
          <div className="mt-4 space-y-4">
            {loading ? (
              <div className="text-center py-4">Loading sessions...</div>
            ) : upcomingSessions.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No upcoming sessions scheduled
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        Session with {getMenteeName(session.mentee)}
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
                    {session.status === 'pending' ? (
                      <button
                        onClick={() => handleConfirmSession(session.id)}
                        disabled={confirmingSession === session.id}
                        className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                          text-white bg-orange-500 hover:bg-orange-600 transition-colors
                          flex items-center gap-2 ${confirmingSession === session.id ? 'opacity-75 cursor-wait' : ''}`}
                      >
                        {confirmingSession === session.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Confirm
                          </>
                        )}
                      </button>
                    ) : (
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
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedSession && (
        <SessionThread
          sessionId={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}