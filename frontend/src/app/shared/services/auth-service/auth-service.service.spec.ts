import { TestBed } from '@angular/core/testing';
import { getCurrentUser } from 'aws-amplify/auth';
import { vi } from 'vitest';
import { AuthServiceService } from './auth-service.service';

vi.mock('aws-amplify/auth', () => ({
  getCurrentUser: vi.fn(),
}));

describe('AuthServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    vi.mocked(getCurrentUser).mockReset();
  });

  it('is logged in when Cognito returns the current user', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      username: 'reader@example.com',
      userId: 'abc',
    });
    const service = TestBed.inject(AuthServiceService);

    await expect(service.isLoggedIn()).resolves.toBe(true);
  });

  it('is logged out when Cognito has no current session', async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(
      Object.assign(new Error('User needs to be authenticated to call this API.'), {
        name: 'UserUnAuthenticatedException',
      }),
    );
    const service = TestBed.inject(AuthServiceService);

    await expect(service.isLoggedIn()).resolves.toBe(false);
  });
});
