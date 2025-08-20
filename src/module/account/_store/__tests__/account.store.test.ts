import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccountStore } from '../account.store';

vi.mock('cookies-next', () => ({ getCookie: vi.fn(() => 'tkn') }));
const toastError = vi.fn();
vi.mock('sonner', () => ({ toast: { error: (...args: any[]) => toastError(...args) } }));
vi.mock('../account.api', () => ({
    getWorkTypeByUserIdApi: vi.fn(async () => ({
        id: '1',
        name: 'Bureau',
        monday: '8',
        tuesday: '8',
        wednesday: '8',
        thursday: '8',
        friday: '8',
        weeklyHour: '40',
    })),
}));
vi.mock('~/module/account/account.utils', () => ({ AccountMenuEnum: { PROFIL: 'PROFIL' } }));

describe('account.store', () => {
    beforeEach(() => {
        const { getState, setState } = useAccountStore;
        setState({
            ...getState(),
            isLoading: false,
            workType: {
                id: '',
                name: '',
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: '',
                weeklyHour: '',
            },
        });
    });

    it('getWorkType récupère et stocke le workType', async () => {
        await useAccountStore.getState().getWorkType('u1');
        expect(useAccountStore.getState().workType.name).toBe('Bureau');
        expect(useAccountStore.getState().isLoading).toBe(false);
    });

    it('getWorkType gère une erreur et appelle toast.error', async () => {
        const mod = await import('../account.api');
        (mod as any).getWorkTypeByUserIdApi = vi.fn(async () => {
            throw new Error('x');
        });
        await useAccountStore.getState().getWorkType('u1');
        expect(useAccountStore.getState().isLoading).toBe(false);
        expect(toastError).toHaveBeenCalled();
    });
});
