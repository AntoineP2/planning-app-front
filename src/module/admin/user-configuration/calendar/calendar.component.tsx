'use client';
import { format, getDay, intlFormat, Locale, parse, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useInView } from 'react-intersection-observer';
import { useCalendarStore } from './_store/calendar.store';
import { CustomEvent, dayStyleGetter, EventComponent, eventStyleGetter } from './calendar.utils';
import { useCalendarModaleCreateForm } from './calendarCreateForm/_store/calendarCreateForm.store';
import { useCalendarUpdateFormStore } from './calendarUpdateForm/_store/calendarUpdateForm.store';
import CustomToolbar from '~/components/admin/calendar/calendarToolBar.component';

const locales = {
    fr: fr,
};

const localizer = dateFnsLocalizer({
    format: (date: Date, formatStr: string, options?: { locale: Locale }) =>
        format(date, formatStr, { ...options, locale: fr }),
    parse: (str: string, formatStr: string, options?: { locale: Locale }) =>
        parse(str, formatStr, new Date(), { ...options, locale: fr }),
    startOfWeek: (date: Date) => startOfWeek(date, { locale: fr }),
    getDay: (date: Date) => getDay(date),
    locales: locales,
});

export const CalendarSample: React.FC = () => {
    const { setEvents, setEventId, setChoiceEventModal, setCreateEventModal, setDate, events, date } = useCalendarStore();
    const { setNewEventDate } = useCalendarModaleCreateForm();
    const { setEvent } = useCalendarUpdateFormStore();
    const [eventsReady, setEventsReady] = useState<CustomEvent[]>([]);
    const searchParams = useSearchParams();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    const userId = searchParams.get('userId') || '';

    const variants = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
    };

    const handleNavigate = (newDate: Date) => {
        setDate(newDate);
    };

    useEffect(() => {
        setEvents(userId, date);
    }, [setEvents, userId, date]);

    const onClickEvent = (event: CustomEvent) => {
        setEvent(event);
        setEventId(event.id);
        setChoiceEventModal(true);
    };

    const onClickEmptyEvent = (event: { start: Date; end: Date }) => {
        let isCantOpen: boolean = false;
        for (const eventItem of events) {
            if (intlFormat(new Date(eventItem.start)) === intlFormat(new Date(event.start))) {
                isCantOpen = true;
            }
        }
        if (!isCantOpen) {
            setNewEventDate(event.start);
            setEvent({
                start: event.start,
                end: event.end,
                title: '',
                allDay: false,
                hourlyAm: '',
                hourlyPm: '',
                id: '0',
                parking: false,
                titleAm: '',
                titlePm: '',
                workTime: '',
            });
            setCreateEventModal(true);
        }
    };

    return (
        <>
            <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    style={{ height: 800 }}
                    views={[Views.MONTH]}
                    defaultView={Views.MONTH}
                    date={date}
                    onSelectEvent={event => onClickEvent(event)}
                    onNavigate={handleNavigate}
                    onSelectSlot={event => onClickEmptyEvent(event)}
                    eventPropGetter={eventStyleGetter}
                    dayPropGetter={dayStyleGetter}
                    components={{
                        toolbar: CustomToolbar as any,
                        event: EventComponent,
                    }}
                />
            </motion.div>
        </>
    );
};

export default CalendarSample;
