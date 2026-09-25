import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProgramFormModal from '../ProgramFormModal';

describe('ProgramFormModal', () => {
  it('displays a field-specific validation error on 422 response', async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce({
      response: {
        status: 422,
        data: {
          success: false,
          message: 'Validation failed.',
          errors: { code: ['The code has already been taken.'] },
        },
      },
    });
    const onClose = vi.fn();

    const user = userEvent.setup();
    render(<ProgramFormModal program={null} onSubmit={onSubmit} onClose={onClose} />);

    await user.type(screen.getByLabelText(/code/i), 'BSCS');
    await user.type(screen.getByLabelText(/name/i), 'Duplicate Program');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/code has already been taken/i)).toBeInTheDocument();
  });

  it('shows a network error message when the request fails to reach the server', async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce({
      isNetworkError: true,
      friendlyMessage: 'Unable to reach the server. Please check your connection and try again.',
    });
    const onClose = vi.fn();

    const user = userEvent.setup();
    render(<ProgramFormModal program={null} onSubmit={onSubmit} onClose={onClose} />);

    await user.type(screen.getByLabelText(/code/i), 'BSIT');
    await user.type(screen.getByLabelText(/name/i), 'BS IT');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/unable to reach the server/i)).toBeInTheDocument();
  });
});