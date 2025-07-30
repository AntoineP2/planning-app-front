import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';
import { toast } from 'sonner';

export const verifyTimeRange = (timeRangeUser: string, timeRangeAdmin: string, isAm: boolean): boolean => {
    const [timeStart, timeEnd] = timeRangeUser.split(' - ');
    const timeStartMs = calculeTimeInMs(timeStart);
    const timeEndMs = calculeTimeInMs(timeEnd);

    const [timeRangeStart, timeRangeEnd] = timeRangeAdmin.split(' - ');
    const timeRangeMs = isAm ? calculeTimeInMs(timeRangeStart) : calculeTimeInMs(timeRangeEnd);

    if (timeStartMs > timeRangeMs || (timeStartMs < timeRangeMs && timeEndMs < timeRangeMs)) {
        return true;
    } else {
        return false;
    }
};

export const verifyLunchBreakTimeIsCorrect = (timeRangeUserAm: string, timeRangeUserPm: string): boolean => {
    const hourInMs = hoursToMilliseconds(1);
    const startLunchBreakInMs = hoursToMilliseconds(12);
    const endLunchBreakInMs = hoursToMilliseconds(14);
    const [_, timeEndAm] = timeRangeUserAm.split(' - ');
    const timeEndAmMs = calculeTimeInMs(timeEndAm);

    const [timeStartPm] = timeRangeUserPm.split(' - ');
    const timeStartPmMs = calculeTimeInMs(timeStartPm);

    //On vérifie la l'heures du début et de fin de la pause
    if (timeEndAmMs < startLunchBreakInMs || timeEndAmMs > endLunchBreakInMs) {
        toast.error('La pause déjeuner doit être prise entre 12h et 14h.');
        return false;
    } else if (timeStartPmMs < startLunchBreakInMs || timeStartPmMs > endLunchBreakInMs) {
        toast.error('La pause déjeuner doit être prise entre 12h et 14h.');
        return false;
    }

    // On vérifie la duré de la pause
    if (timeStartPmMs - timeEndAmMs < hourInMs) {
        toast.error("La pause déjeuner doit être d'une durée minimum d'une heure.");
        return false;
    } else if (timeStartPmMs - timeEndAmMs > hourInMs * 2) {
        toast.error("La pause déjeuner doit être d'une durée maximum de 2 heures.");
        return false;
    }

    return true;
};

const calculeTimeInMs = (timeString: string): number => {
    const timeStart = timeString.split(':');
    const hourTimeStart = parseInt(timeStart[0]);
    const minuteTimStart = parseInt(timeStart[1]);
    const timeMs = hoursToMilliseconds(hourTimeStart) + minutesToMilliseconds(minuteTimStart);
    return timeMs;
};

export const hourPmRange: number[] = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
export const hourAmRange: number[] = [6, 7, 8, 9, 10, 11, 12, 13];
export const minutesList: number[] = [0, 15, 30, 45];
