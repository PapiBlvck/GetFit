import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '@contexts/AuthContext';
import { auth } from '@api/firebase/config';

// Mock Firebase auth
vi.mock('@api/firebase/config', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
}));

const TestComponent = () => {
  const { currentUser, loading, login, logout } = useAuth();
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && currentUser && <div>Logged in as {currentUser.email}</div>}
      {!loading && !currentUser && <div>Not logged in</div>}
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('Auth Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    const mockOnAuthStateChanged = vi.fn((callback) => {
      // Don't call callback immediately to simulate loading
      return () => {}; // Return unsubscribe function
    });
    
    (auth.onAuthStateChanged as any) = mockOnAuthStateChanged;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show not logged in state when no user', async () => {
    const mockOnAuthStateChanged = vi.fn((callback) => {
      callback(null); // No user
      return () => {};
    });
    
    (auth.onAuthStateChanged as any) = mockOnAuthStateChanged;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  it('should show user email when logged in', async () => {
    const mockUser = {
      email: 'test@example.com',
      uid: 'test-uid-123',
    };

    const mockOnAuthStateChanged = vi.fn((callback) => {
      callback(mockUser);
      return () => {};
    });
    
    (auth.onAuthStateChanged as any) = mockOnAuthStateChanged;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument();
    });
  });

  it('should handle auth state changes', async () => {
    let authCallback: any = null;
    
    const mockOnAuthStateChanged = vi.fn((callback) => {
      authCallback = callback;
      callback(null); // Start logged out
      return () => {};
    });
    
    (auth.onAuthStateChanged as any) = mockOnAuthStateChanged;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });

    // Simulate user login
    authCallback({ email: 'newuser@example.com', uid: 'new-uid' });

    await waitFor(() => {
      expect(screen.getByText('Logged in as newuser@example.com')).toBeInTheDocument();
    });
  });
});

