import { vi } from 'vitest';

// Mocks simples pour éviter les erreurs sur les libs de browser/Next
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }));

// Variables d'environnement nécessaires aux API
vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://api');
vi.stubEnv('NEXT_PUBLIC_API_KEY', 'key');
vi.stubEnv('NEXT_PUBLIC_API_URL_SSO', 'http://sso');
