import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Programs from '../Programs';
import apiClient from '../../services/apiClient';

vi.mock('../../services/apiClient');

function renderPrograms() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Programs />
    </QueryClientProvider>
  );
}

describe('Programs list', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a list of programs fetched from the API', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          { id: 1, code: 'BSCS', name: 'BS Computer Science', status: 'active' },
          { id: 2, code: 'BSIT', name: 'BS Information Technology', status: 'active' },
        ],
        meta: { current_page: 1, per_page: 10, total: 2, last_page: 1 },
      },
    });

    renderPrograms();

    expect(screen.getByText(/loading programs/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('BSCS')).toBeInTheDocument();
      expect(screen.getByText('BS Computer Science')).toBeInTheDocument();
      expect(screen.getByText('BSIT')).toBeInTheDocument();
    });
  });

  it('shows an empty state when there are no programs', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: { success: true, data: [], meta: { current_page: 1, per_page: 10, total: 0, last_page: 1 } },
    });

    renderPrograms();

    expect(await screen.findByText(/no programs found/i)).toBeInTheDocument();
  });
});