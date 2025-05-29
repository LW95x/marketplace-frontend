import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const tokenExpiredCheck = (token: string): boolean => {
  const payload = token.split('.')[1];
  const parsedPayload = JSON.parse(atob(payload));
  const expiryTime = parsedPayload.exp;
  const currentTime = Math.floor(Date.now() / 1000);

  return expiryTime < currentTime;
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token || tokenExpiredCheck(token)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
