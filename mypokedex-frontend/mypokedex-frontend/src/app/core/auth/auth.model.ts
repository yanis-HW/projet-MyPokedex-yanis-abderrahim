/**
 * Modèles liés à l'authentification.
 * Ces interfaces décrivent les payloads échangés avec l'API Jakarta EE.
 * 
 * Le backend attend :
 * - LoginRequest : email + password
 * - RegisterRequest : name + email + password
 * - AuthResponse : trainerId + email + name
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Réponse du backend après login/register.
 * Correspond au DTO AuthResponse du backend Java.
 */
export interface AuthResponse {
  trainerId: number;
  email: string;
  name: string;
}

