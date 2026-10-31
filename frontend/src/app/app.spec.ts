import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { AuthServiceService } from './shared/services/auth-service/auth-service.service';

describe('App', () => {
  let authenticated: ReturnType<typeof signal<boolean>>;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    authenticated = signal(false);
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: AuthServiceService,
          useValue: {
            isAuthenticated: authenticated.asReadonly(),
            isLoggedIn: () => Promise.resolve(authenticated()),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('hides the header until the user is authenticated', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('app-header')).toBeNull();

    authenticated.set(true);
    fixture.detectChanges();
    expect(host.querySelector('app-header')).not.toBeNull();
    expect(host.querySelector('h2')?.textContent).toContain('Book Nook');
  });
});
