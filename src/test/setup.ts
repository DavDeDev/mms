import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock environment variables
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-key');

// Mock window.crypto for UUID generation
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid'
  }
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver as any;