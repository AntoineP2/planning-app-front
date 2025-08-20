import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    test: {
        environment: 'node',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            all: true,
            include: [
                'src/lib/utils/**/*.ts',
                'src/module/calendar/_store/calendar.store.ts',
                'src/module/calendar/_store/calendar.api.ts',
                'src/module/team-calendar/_store/teamCalendar.store.ts',
                'src/module/team-calendar/_store/teamCalendar.api.ts',
                'src/module/admin/user-configuration/calendar/_store/calendar.store.ts',
                'src/module/authentication/_store/authentication.store.ts',
                'src/module/authentication/_store/authentication.api.ts',
                'src/module/account/_store/account.store.ts',
            ],
            exclude: ['src/lib/utils/type.ts', 'src/module/admin/user-configuration/calendar/_store/calendar.api.ts'],
        },
    },
});
