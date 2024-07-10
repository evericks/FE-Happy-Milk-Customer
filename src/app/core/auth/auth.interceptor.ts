import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment.prod';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const router = inject(Router)
    const baseUrl = environment.apiURL;

    // Clone the request object
    let newReq = req.clone();
    if (req.url.startsWith('/')) {
        newReq = req.clone({
            url: baseUrl + req.url
        });
    }

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
        if (req.url.startsWith('/')) {
            newReq = req.clone({
                url: baseUrl + req.url,
                headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken)
            });
        };
    }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Sign out
                authService.signOut();

                // Reload the app
                location.reload();
            }

            // Catch "406 Not Accepted" responses
            if (error instanceof HttpErrorResponse && error.status === 406) {
                // Sign out
                authService.signOut();

                // Navigate to 406 page
                router.navigate(['/406-not-accepted']);
            }

            // Catch "500 Internal Server Error" responses
            if (error instanceof HttpErrorResponse && error.status === 500) {
                // Sign out
                authService.signOut();

                // Navigate to 500 page
                router.navigate(['/500-internal-server-error']);
            }

            return throwError(error);
        }),
    );
};
