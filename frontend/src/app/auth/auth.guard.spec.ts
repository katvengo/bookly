import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { authGuard, loggedInMatch, loggedOutMatch } from './auth.guard';
import { AuthServiceService } from '@/shared/services/auth-service/auth-service.service';

describe('authGuard', () => {
  function setup(loggedIn: boolean) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthServiceService,
          useValue: { isLoggedIn: () => Promise.resolve(loggedIn) },
        },
      ],
    });
  }

  it('allows the route when a user is signed in', async () => {
    setup(true);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );

    expect(result).toBe(true);
  });

  it('sends signed-out visitors to the login page', async () => {
    setup(false);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );
    const login = TestBed.inject(Router).createUrlTree(['/login']);

    expect(result).toBeInstanceOf(UrlTree);
    expect(result).toEqual(login);
  });

  it('matches the signed-in route only for signed-in users', async () => {
    setup(true);

    const loggedIn = await TestBed.runInInjectionContext(() => loggedInMatch({} as never, [], {} as never));
    const loggedOut = await TestBed.runInInjectionContext(() => loggedOutMatch({} as never, [], {} as never));

    expect(loggedIn).toBe(true);
    expect(loggedOut).toBe(false);
  });

  it('matches the signed-out route only for signed-out visitors', async () => {
    setup(false);

    const loggedIn = await TestBed.runInInjectionContext(() => loggedInMatch({} as never, [], {} as never));
    const loggedOut = await TestBed.runInInjectionContext(() => loggedOutMatch({} as never, [], {} as never));

    expect(loggedIn).toBe(false);
    expect(loggedOut).toBe(true);
  });
});
