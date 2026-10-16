import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthServiceService } from '@/shared/services/auth-service.service';

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
});
