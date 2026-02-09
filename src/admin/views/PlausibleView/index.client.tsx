'use client';

import { KPICard } from '@/admin/components/KPICard';
import { Table } from '@/admin/components/Table';
import { ViewHeader } from '@/admin/components/ViewHeader';
import {
  formatDuration,
  formatNumber,
  formatPercentage,
  type PlausibleData,
} from '@/lib/plausible';
import { cn } from '@/utilities/cn';
import { Popup, PopupList } from '@payloadcms/ui';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './index.scss';

enum TimePeriods {
  day = 'Last 24 Hours',
  '7d' = 'Last 7 Days',
  '30d' = 'Last 30 Days',
  '12mo' = 'Last 12 Months',
}

const timelineColor = '#ffdc68';

function formatAxisDate(dateStr: string, period: string, _index?: number, _total?: number): string {
  const date = new Date(dateStr);

  switch (period) {
    case 'day':
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    case '12mo':
      const month = date.getMonth();

      if (month === 0) {
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }

      return date.toLocaleDateString('en-US', { month: 'short' });
    case '30d':
      return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    default:
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
  }
}

function formatTooltipDate(dateStr: string, period: string): string {
  const date = new Date(dateStr);

  if (period === 'day') {
    return (
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' +
      date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
    );
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const AnalyticsClient: React.FC = () => {
  const [data, setData] = useState<PlausibleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<keyof typeof TimePeriods>('7d');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/analytics/detailed?period=${period}`);

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data.');
        }

        const analyticsData = await response.json();

        setData(analyticsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error has occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error || !data) {
    return <div>{error || 'Unable to load analytics data.'}</div>;
  }

  const { stats, timeseries, pages, sources, events, realtime } = data;

  return (
    <div className="dashboard">
      <div className="dashboard__wrap">
        <ViewHeader
          title="Analytics Dashboard"
          TitleActions={[
            <div
              key="realtime-visitors"
              className={cn('analytics__realtime', {
                'analytics__realtime--online': realtime.visitors > 0,
              })}
            >
              <span className="marker"></span>
              <span className="detail">{`${realtime.visitors} Current ${realtime.visitors === 1 ? 'Visitor' : 'Visitors'}`}</span>
            </div>,
          ]}
          Actions={[
            <Popup
              key="period-select"
              button={
                <div>
                  <span>Time Period: {TimePeriods[period]}</span> <ChevronDownIcon size={16} />
                </div>
              }
              buttonClassName="btn btn--icon btn--icon-style-without-border btn--size-medium btn--icon-position-right btn--style-subtle"
              render={({ close: closePopup }) => (
                <PopupList.ButtonGroup>
                  {Object.keys(TimePeriods).map((key) => (
                    <PopupList.Button
                      key={`time-period-${key}`}
                      onClick={() => {
                        closePopup();
                        setPeriod(key as keyof typeof TimePeriods);
                      }}
                    >
                      {TimePeriods[key as keyof typeof TimePeriods]}
                    </PopupList.Button>
                  ))}
                </PopupList.ButtonGroup>
              )}
            ></Popup>,
          ]}
        />
        <div className="dashboard__group analytics__kpis">
          <h2 className="dashboard__label">Time Period KPIs</h2>
          <ul className="dashboard__card-list dashboard__card-list--gutter-bottom">
            <KPICard
              title={'Total Visitors'}
              value={stats.visitors.value}
              change={stats.visitors.change}
              formatter={formatNumber}
              isPositiveGood
            />
            <KPICard
              title={'Pageviews'}
              value={stats.pageviews.value}
              change={stats.pageviews.change}
              formatter={formatNumber}
              isPositiveGood
            />
            <KPICard
              title={'Bounce Rate'}
              value={stats.bounce_rate.value}
              change={stats.bounce_rate.change}
              formatter={formatPercentage}
              isPositiveGood={false}
            />
            <KPICard
              title={'Visit Duration'}
              value={stats.visit_duration.value}
              change={stats.visit_duration.change}
              formatter={formatDuration}
              isPositiveGood
            />
          </ul>
          <div className="dashboard__group dashboard__group--gutter-bottom">
            <h2 className="dashboard__label">Visitors Over Time</h2>
            {timeseries.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={timeseries} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={timelineColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={timelineColor} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="var(--theme-elevation-200)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value, index) =>
                      formatAxisDate(value, period, index, timeseries.length)
                    }
                    tick={{ fill: 'var(--theme-elevation-600)' }}
                    stroke="var(--theme-border-color)"
                    style={{ fontSize: '0.75rem' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickFormatter={formatNumber}
                    tick={{ fill: 'var(--theme-elevation-600)' }}
                    stroke="var(--theme-border-color)"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--theme-elevation-50)',
                      borderRadius: '0.25rem',
                      border: '1px solid var(--theme-elevation-200)',
                      color: 'var(--theme-text-dark)',
                      padding: '8px 12px',
                      fontSize: '0.875rem',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ color: 'var(--theme-text-light)', marginBottom: '0.25rem' }}
                    itemStyle={{ color: 'var(--theme-text-dark)' }}
                    labelFormatter={(label) => formatTooltipDate(label, period)}
                    formatter={(value) => [`${formatNumber(value)}`, 'Visitors']}
                    separator=" "
                  />
                  <Area
                    dataKey={'visitors'}
                    type="monotone"
                    stroke={timelineColor}
                    fill="url(#colorVisitors)"
                    fillOpacity="1"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available for this period.</p>
            )}
          </div>
          <div className="dashboard__group" style={{ margin: '0 0 2rem' }}>
            <Table
              title="Top Pages"
              columns={[
                { key: 'page', label: 'Page' },
                { key: 'visitors', label: 'Visitors', formatter: formatNumber },
                { key: 'pageviews', label: 'Pageviews', formatter: formatNumber },
                { key: 'bounce_rate', label: 'Bounce Rate', formatter: formatPercentage },
              ]}
              rows={pages}
            />
            <Table
              title="Top Sources"
              columns={[
                { key: 'source', label: 'Source' },
                { key: 'visitors', label: 'Visitors', formatter: formatNumber },
                { key: 'visit_duration', label: 'Visit Duration', formatter: formatDuration },
                { key: 'bounce_rate', label: 'Bounce Rate', formatter: formatPercentage },
              ]}
              rows={sources}
            />
            {events && events.length > 0 && (
              <Table
                title="Events & Goals"
                columns={[
                  { key: 'goal', label: 'Event' },
                  { key: 'visitors', label: 'Visitors', formatter: formatNumber },
                  { key: 'events', label: 'Total Events', formatter: formatNumber },
                  { key: 'conversion_rate', label: 'Conversion Rate', formatter: formatPercentage },
                ]}
                rows={events}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
