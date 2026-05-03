/**
 * Centralized application configuration.
 * Uses environment variables with sensible defaults for local development.
 */
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  },
  app: {
    name: 'Electionverse 2.0',
    version: '2.0.0',
  }
};
