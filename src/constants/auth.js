/**
 * ------------------------------------------------------------------
 * Authentication Configuration
 * ------------------------------------------------------------------
 *
 * Central location for authentication-related constants.
 *
 * Avoid hardcoding values like bcrypt salt rounds
 * throughout the application.
 * ------------------------------------------------------------------
 */

export const authConfig = Object.freeze({
  /**
   * bcrypt Cost Factor
   *
   * Higher value:
   *  - More secure
   *  - Slower hashing
   *
   * 10 is a good balance for most applications.
   */
  PASSWORD_SALT_ROUNDS: 10,
});