export interface JWTPayload {
  sub?: string;
  user_id?: string;
  userId?: string;
  id?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export class JWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWTError';
  }
}

/**
 * Decodes a JWT token and returns the payload
 * @param token - The JWT token string
 * @returns The decoded payload object
 * @throws {JWTError} If the token is invalid or malformed
 */
export function decodeJWT(token: string): JWTPayload {
  if (!token || typeof token !== 'string') {
    throw new JWTError('Invalid token: token must be a non-empty string');
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new JWTError('Invalid token: JWT must have 3 parts');
  }

  try {
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    throw new JWTError('Invalid token: Failed to decode payload');
  }
}

/**
 * Extracts the user ID from a JWT token
 * Checks common JWT claim fields: sub, user_id, userId, id
 * @param token - The JWT token string
 * @returns The user ID as a string
 * @throws {JWTError} If the token is invalid or user ID is not found
 */
export function extractUserIdFromJWT(token: string): string {
  const payload = decodeJWT(token);

  const userId = payload.sub || payload.user_id || payload.userId || payload.id;

  if (!userId) {
    throw new JWTError('User ID not found in token payload');
  }

  return userId;
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if the token is expired, false otherwise
 */
export function isJWTExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);

    if (!payload.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Extracts the user ID from a JWT token stored in a cookie or Authorization header
 * @param cookieString - The cookie string (e.g., from document.cookie)
 * @param cookieName - The name of the cookie containing the JWT (default: 'token')
 * @returns The user ID as a string, or null if not found
 */
export function extractUserIdFromCookie(
  cookieString: string,
  cookieName: string = 'token'
): string | null {
  const cookies = cookieString.split(';').map(cookie => cookie.trim());

  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === cookieName) {
      try {
        return extractUserIdFromJWT(value);
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Extracts the user ID from an Authorization header
 * @param authHeader - The Authorization header value (e.g., "Bearer token123")
 * @returns The user ID as a string, or null if not found
 */
export function extractUserIdFromAuthHeader(authHeader: string): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    try {
      return extractUserIdFromJWT(parts[1]);
    } catch {
      return null;
    }
  }

  return null;
}
