/**
 * Progress component displays a timeline of mentee progress updates.
 * Shows messages, resource completions, and other progress indicators.
 */
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle, MessageSquare, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProgressUpdate } from '../types';

interface ProgressProps {
  /** ID of the session to show progress for */
  sessionId: string;
}

export function Progress({ sessionId }: ProgressProps) {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpdates();
    const subscription = subscribeToUpdates();
    return () => {
      subscription();
    };
  }, [sessionId]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);

      // Fetch messages from mentee
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender:sender_id (
            id,
            full_name,
            display_name,
            role
          )
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Fetch resource completions
      const { data: resources, error: resourcesError } = await supabase
        .from('session_resources')
        .select(`
          id,
          title,
          completed_at,
          completion_comment,
          author:author_id (
            id,
            full_name,
            display_name,
            role
          )
        `)
        .eq('session_id', sessionId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (resourcesError) throw resourcesError;

      // Filter and combine updates
      const formattedUpdates: ProgressUpdate[] = [
        ...(messages || [])
          .filter(msg => msg.sender.role === 'mentee') // Only include mentee messages
          .map(msg => ({
            id: msg.id,
            title: 'New Message',
            content: msg.content,
            created_at: msg.created_at,
            author: msg.sender,
            type: 'message' as const
          })),
        ...(resources || [])
          .filter(res => res.author.role === 'mentee') // Only include mentee completions
          .map(res => ({
            id: res.id,
            title: 'Resource Completed',
            content: `Completed resource: ${res.title}`,
            created_at: res.completed_at!,
            author: res.author,
            type: 'completion' as const,
            completion_comment: res.completion_comment
          }))
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setUpdates(formattedUpdates);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const messageChannel = supabase.channel(`messages:${sessionId}`);
    const resourceChannel = supabase.channel(`resources:${sessionId}`);

    messageChannel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        () => {
          fetchUpdates();
        }
      )
      .subscribe();

    resourceChannel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'session_resources',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          if (payload.new.completed && !payload.old.completed) {
            fetchUpdates();
          }
        }
      )
      .subscribe();

    return () => {
      messageChannel.unsubscribe();
      resourceChannel.unsubscribe();
    };
  };

  const getAuthorName = (author: { full_name: string | null; display_name: string | null }) => {
    return author.display_name || author.full_name || 'Anonymous';
  };

  const getUpdateIcon = (type: ProgressUpdate['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-orange-500" />;
      case 'resource':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'completion':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading progress updates...</div>
      ) : updates.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No activity recorded yet.
        </div>
      ) : (
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-6 w-px bg-gray-200"></div>
          <div className="space-y-6">
            {updates.map((update) => (
              <div key={update.id} className="relative flex items-start">
                <div className="absolute left-0 w-12 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center ring-8 ring-white">
                    {getUpdateIcon(update.type)}
                  </div>
                </div>
                <div className="ml-12 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {update.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        by {getAuthorName(update.author)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(update.created_at), 'PPp')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {update.content}
                    {update.type === 'completion' && update.completion_comment && (
                      <>
                        <br />
                        <span className="italic">"{update.completion_comment}"</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}