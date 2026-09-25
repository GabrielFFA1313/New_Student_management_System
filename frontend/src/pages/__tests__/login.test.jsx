import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../login';
import { AuthProvider } from '../../context/authContext';
import apiClient from '../../services/apiClient';

vi.mock('../../services/apiClient');

function renderLogin() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('logs in successfully and stores the token', async () => {
    apiClient.get.mockRejectedValueOnce({ response: { status: 401 } }); // no existing session on mount
    apiClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Login successful.',
        data: {
          token: 'fake-token-123',
          user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'administrator' },
        },
      },
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token-123');
    });
  });

  it('shows an error message on invalid credentials', async () => {
    apiClient.get.mockRejectedValueOnce({ response: { status: 401 } });
    apiClient.post.mockRejectedValueOnce({
      response: {
        status: 422,
        data: {
          success: false,
          message: 'Validation failed.',
          errors: { email: ['The provided credentials are incorrect.'] },
        },
      },
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/provided credentials are incorrect/i)).toBeInTheDocument();
  });
});