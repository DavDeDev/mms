import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionThread } from './SessionThread';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ 
        data: { 
          id: 'test-message-id',
          content: 'Test message',
          created_at: new Date().toISOString(),
          sender: {
            id: 'test-profile',
            full_name: 'Test User',
            display_name: null
          }
        }, 
        error: null 
      }))
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn()
      })),
      unsubscribe: vi.fn()
    }))
  }
}));

// Mock auth store
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: {
      id: 'test-user',
      profileId: 'test-profile',
      role: 'mentor'
    }
  }))
}));

describe('SessionThread', () => {
  const mockProps = {
    sessionId: 'test-session',
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<SessionThread {...mockProps} />);
    expect(screen.getByText(/loading messages/i)).toBeInTheDocument();
  });

  test('displays empty state when no messages', async () => {
    render(<SessionThread {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
    });
  });

  test('handles message submission', async () => {
    const user = userEvent.setup();
    render(<SessionThread {...mockProps} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading messages/i)).not.toBeInTheDocument();
    });

    // Find the input in the chat tab
    const chatTab = screen.getByRole('button', { name: /chat/i });
    await user.click(chatTab);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, 'Test message');
    await user.click(submitButton);

    expect(supabase.from).toHaveBeenCalledWith('messages');
    expect(input).toHaveValue('');
  });

  test('prevents submission of empty messages', async () => {
    const user = userEvent.setup();
    render(<SessionThread {...mockProps} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading messages/i)).not.toBeInTheDocument();
    });

    // Find the input in the chat tab
    const chatTab = screen.getByRole('button', { name: /chat/i });
    await user.click(chatTab);

    const submitButton = screen.getByRole('button', { name: /send/i });
    expect(submitButton).toBeDisabled();

    const input = screen.getByPlaceholderText(/type your message/i);
    await user.type(input, '   '); // Only whitespace
    expect(submitButton).toBeDisabled();

    expect(supabase.from).not.toHaveBeenCalledWith('messages');
  });

  test('closes on clicking outside', async () => {
    const { container } = render(<SessionThread {...mockProps} />);
    
    // Click outside the modal content
    fireEvent.mouseDown(document.body);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('switches between tabs', async () => {
    const user = userEvent.setup();
    render(<SessionThread {...mockProps} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading messages/i)).not.toBeInTheDocument();
    });

    // Test switching to Resources tab
    const resourcesTab = screen.getByRole('button', { name: /resources/i });
    await user.click(resourcesTab);
    expect(screen.getByText(/no resources have been added yet/i)).toBeInTheDocument();

    // Test switching back to Chat tab
    const chatTab = screen.getByRole('button', { name: /chat/i });
    await user.click(chatTab);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();

    // Test switching to Progress tab (mentor only)
    const progressTab = screen.getByRole('button', { name: /progress/i });
    await user.click(progressTab);
    expect(screen.getByText(/loading progress updates/i)).toBeInTheDocument();
  });

  test('handles message errors', async () => {
    // Mock Supabase error response
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: null, error: new Error('Database error') }))
        }))
      }))
    }));

    render(<SessionThread {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/error:/i)).toBeInTheDocument();
    });
  });
});