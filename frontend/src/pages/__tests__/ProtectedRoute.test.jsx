import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import * as AuthContext from '../../context/authContext';

describe('ProtectedRoute', () => {
  it('redirects to /login when there is no authenticated user', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter initialEntries={['/students']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <div>Students Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to /forbidden when the user role is not allowed', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 3, role: 'student' },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/programs']}>
        <Routes>
          <Route path="/forbidden" element={<div>Forbidden Page</div>} />
          <Route
            path="/programs"
            element={
              <ProtectedRoute allowedRoles={['administrator', 'registrar']}>
                <div>Programs Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
  });

  it('renders the protected content when the user has an allowed role', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 1, role: 'administrator' },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/programs']}>
        <Routes>
          <Route
            path="/programs"
            element={
              <ProtectedRoute allowedRoles={['administrator', 'registrar']}>
                <div>Programs Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Programs Page')).toBeInTheDocument();
  });
});