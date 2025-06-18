import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './core/auth-service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptor } from './core/http-interceptor';
import { provideZonelessChangeDetection } from '@angular/core';


const initializer = () => {
  const authService = inject(AuthService);
  try {
    const accesstoken = localStorage.getItem('access-token');
    const refreshtoken = localStorage.getItem('refresh-token');
    const user = localStorage.getItem('user');

    if (!accesstoken || !user || !refreshtoken) {
      throw new Error("Something went wrong")
    }

    authService.userValue = JSON.parse(user);
    authService.accessTokenValue = accesstoken;
    authService.refreshTokenValue = refreshtoken;
  } catch (error) {
    authService.logout();
  }

}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAppInitializer(initializer),
    provideBrowserGlobalErrorListeners(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true
    }
  ]
};

