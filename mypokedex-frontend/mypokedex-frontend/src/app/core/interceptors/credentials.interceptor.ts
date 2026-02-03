import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepteur global qui force `withCredentials: true`
 * pour que le cookie de session (JSESSIONID) soit envoyé
 * à chaque requête vers le backend Jakarta EE.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    withCredentials: true
  });

  return next(cloned);
};

