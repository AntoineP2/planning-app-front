import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    hourAmRange,
    hourPmRange,
    minutesList,
    verifyLunchBreakTimeIsCorrect,
    verifyTimeRange,
} from '../calendarGeneral.utils';

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

describe('calendarGeneral.utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('verifyTimeRange retourne false quand la plage utilisateur chevauche le seuil admin (AM)', () => {
        const result = verifyTimeRange('08:00 - 10:00', '09:00 - 17:00', true);
        expect(result).toBe(false);
    });

    it('verifyTimeRange retourne true quand la plage utilisateur reste avant le seuil (PM)', () => {
        const result = verifyTimeRange('14:00 - 16:00', '09:00 - 17:00', false);
        expect(result).toBe(true);
    });

    it('verifyLunchBreakTimeIsCorrect accepte une pause de 1h entre 12h et 14h', () => {
        const result = verifyLunchBreakTimeIsCorrect('09:00 - 12:30', '13:30 - 17:00');
        expect(result).toBe(true);
    });

    it('verifyLunchBreakTimeIsCorrect refuse pause commencée avant 12h', () => {
        const result = verifyLunchBreakTimeIsCorrect('09:00 - 11:50', '12:50 - 17:00');
        expect(result).toBe(false);
    });

    it('verifyLunchBreakTimeIsCorrect refuse pause commencée après 14h', () => {
        const result = verifyLunchBreakTimeIsCorrect('09:00 - 14:10', '15:10 - 17:00');
        expect(result).toBe(false);
    });

    it('verifyLunchBreakTimeIsCorrect refuse pause < 1h', () => {
        const result = verifyLunchBreakTimeIsCorrect('09:00 - 12:50', '13:30 - 17:00');
        expect(result).toBe(false);
    });

    it('verifyLunchBreakTimeIsCorrect refuse pause > 2h', () => {
        const result = verifyLunchBreakTimeIsCorrect('09:00 - 12:00', '14:10 - 17:00');
        expect(result).toBe(false);
    });

    it('liste des heures/minutes de référence exposées', () => {
        expect(Array.isArray(hourAmRange)).toBe(true);
        expect(Array.isArray(hourPmRange)).toBe(true);
        expect(Array.isArray(minutesList)).toBe(true);
        expect(minutesList).toContain(15);
    });
});
