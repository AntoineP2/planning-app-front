import { describe, expect, it } from 'vitest';
import { companyNameRegex, descriptionRegex, officeNumberRegex, ParkingPlaceNumberRegex } from '../regex.utils';

describe('regex.utils', () => {
    it('descriptionRegex valide une courte description', () => {
        expect(descriptionRegex.test('Bonjour, monde!')).toBe(true);
    });

    it("officeNumberRegex n'accepte que alphanumérique", () => {
        expect(officeNumberRegex.test('A12')).toBe(true);
        expect(officeNumberRegex.test('A-12')).toBe(false);
    });

    it('ParkingPlaceNumberRegex accepte alphanumérique', () => {
        expect(ParkingPlaceNumberRegex.test('B22')).toBe(true);
    });

    it('companyNameRegex valide un nom simple', () => {
        expect(companyNameRegex.test('Société & Fils')).toBe(true);
    });
});
