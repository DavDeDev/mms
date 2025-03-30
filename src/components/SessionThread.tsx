/**
 * SessionThread component displays a real-time chat thread for a mentoring session.
 * Includes message history, file sharing, and progress tracking features.
 */
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Send, X, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Resources } from './Resources';
import { Progress } from './Progress';
import { Message } from '../types';

interface SessionThreadProps {
  /** ID of the session to display */
  sessionId: string;
  /** Function to call when closing the thread */
  onClose: () => void;
}

export function SessionThread({ sessionId, onClose }: SessionThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'resources' | 'progress'>('chat');

  // Handle click outside to close modal
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial messages and set up real-time subscription
  useEffect(() => {
    fetchMessages();
    const subscription = subscribeToMessages();
    return () => {
      subscription();
    };
  }, [sessionId]);

  // Fetch message history
  const fetchMessages = async () => {
    try {
      const { data, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender:sender_id (
            id,
            full_name,
            display_name
          )
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time message subscription
  const subscribeToMessages = () => {
    const channel = supabase.channel(`messages:${sessionId}`);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        async (payload) => {
          const { data: newMessage, error } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              created_at,
              sender:sender_id (
                id,
                full_name,
                display_name
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && newMessage) {
            setMessages(currentMessages => {
              const exists = currentMessages.some(msg => msg.id === newMessage.id);
              if (exists) {
                return currentMessages;
              }
              return [...currentMessages, newMessage];
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  // Handle message submission
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.profileId || !newMessage.trim()) return;

    const messageContent = newMessage.trim();
    
    if (messageContent.startsWith('__SYSTEM_')) {
      setError('Invalid message format');
      return;
    }
    
    setNewMessage('');

    const optimisticId = crypto.randomUUID();
    const optimisticMessage: Message = {
      id: optimisticId,
      content: messageContent,
      created_at: new Date().toISOString(),
      sender: {
        id: user.profileId,
        full_name: null,
        display_name: null
      }
    };

    setMessages(currentMessages => [...currentMessages, optimisticMessage]);

    try {
      const { data, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            session_id: sessionId,
            sender_id: user.profileId,
            content: messageContent
          }
        ])
        .select(`
          id,
          content,
          created_at,
          sender:sender_id (
            id,
            full_name,
            display_name
          )
        `)
        .single();

      if (messageError) throw messageError;

      if (data) {
        setMessages(currentMessages =>
          currentMessages.map(msg =>
            msg.id === optimisticId ? data : msg
          )
        );
      }
    } catch (err) {
      setMessages(currentMessages => 
        currentMessages.filter(msg => msg.id !== optimisticId)
      );
      setError((err as Error).message);
      setNewMessage(messageContent);
    }
  };

  const getSenderName = (sender: { full_name: string | null; display_name: string | null }) => {
    return sender.display_name || sender.full_name || 'Anonymous';
  };

  const renderMessageContent = (message: Message) => {
    if (message.content.startsWith('__SYSTEM_RESOURCE_COMPLETED__')) {
      const [, title, comment] = message.content.split('__SYSTEM_RESOURCE_COMPLETED__')[1].split('\n');
      return (
        <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-green-800 font-medium">Resource Completed: {title}</p>
            {comment && (
              <p className="text-green-700 mt-1 italic">"{comment}"</p>
            )}
          </div>
        </div>
      );
    }
    return <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'chat' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'resources' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </button>
            {user?.role === 'mentor' && (
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'progress' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab('progress')}
              >
                Progress
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-4">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${
                        message.sender.id === user?.profileId 
                          ? 'justify-end' 
                          : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[80%] rounded-lg shadow-sm p-4 ${
                        message.content.startsWith('__SYSTEM_')
                          ? 'bg-white'
                          : message.sender.id === user?.profileId 
                            ? 'bg-orange-50' 
                            : 'bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900">
                              {getSenderName(message.sender)}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              {format(new Date(message.created_at), 'PPp')}
                            </span>
                          </div>
                        </div>
                        {renderMessageContent(message)}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}
          {activeTab === 'resources' && (
            <Resources sessionId={sessionId} user={user} />
          )}
          {activeTab === 'progress' && user?.role === 'mentor' && (
            <Progress sessionId={sessionId} />
          )}
        </div>

        {activeTab === 'chat' && (
          <div className="p-4 border-t">
            <form onSubmit={handleSubmitMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}