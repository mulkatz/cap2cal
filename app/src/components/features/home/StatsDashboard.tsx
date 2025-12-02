import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { StatsCard } from './StatsCard';
import { Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const StatsDashboard: React.FC = () => {
  const { t } = useTranslation();

  // Query all events
  const allEvents = useLiveQuery(() => db.eventItems.toArray());

  // Calculate stats
  const stats = useMemo(() => {
    if (!allEvents) {
      return { total: 0, upcoming: 0, thisMonth: 0 };
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let upcoming = 0;
    let thisMonth = 0;

    allEvents.forEach((event) => {
      const eventDateStr = event.dateTimeFrom?.date;
      if (!eventDateStr) return;

      const eventDate = new Date(eventDateStr);

      // Count upcoming events (today or later)
      if (eventDate >= todayStart) {
        upcoming++;
      }

      // Count events this month
      if (eventDate >= monthStart && eventDate <= monthEnd) {
        thisMonth++;
      }
    });

    return {
      total: allEvents.length,
      upcoming,
      thisMonth,
    };
  }, [allEvents]);

  // Don't show stats if user has no events yet
  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="flex w-full gap-3 px-4">
      <StatsCard
        label={t('home.stats.totalEvents', 'Total Events')}
        value={stats.total}
        icon={<Sparkles size={20} strokeWidth={2.5} />}
        delay={0}
      />
      <StatsCard
        label={t('home.stats.upcoming', 'Upcoming')}
        value={stats.upcoming}
        icon={<TrendingUp size={20} strokeWidth={2.5} />}
        delay={100}
      />
      <StatsCard
        label={t('home.stats.thisMonth', 'This Month')}
        value={stats.thisMonth}
        icon={<Calendar size={20} strokeWidth={2.5} />}
        delay={200}
      />
    </div>
  );
};
