import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../_services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const isLoggedIn = userService.isLoggedIn;
  if (!isLoggedIn) {
    router.navigate(['/login'], { queryParams: { redirect: state.url } });
  }

  return isLoggedIn;
};
