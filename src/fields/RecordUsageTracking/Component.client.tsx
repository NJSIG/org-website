'use client';

import { cn } from '@/utilities/cn';
import { ChevronIcon } from '@payloadcms/ui';
import { useMemo, useState } from 'react';
import { RecordUsageData, RecordUsageTotals } from './types';

type SortableKeys = keyof Omit<RecordUsageData, 'href' | 'id'>;

type RecordUsageColumns = {
  label: string;
  accessor: SortableKeys;
};

const COLUMNS: RecordUsageColumns[] = [
  { label: 'Consuming Document', accessor: 'title' },
  { label: 'Collection', accessor: 'collection' },
  { label: 'Usage Count', accessor: 'useCount' },
];

export const RecordUsageTrackingFieldClientComponent: React.FC<{
  data: RecordUsageData[];
  totals: RecordUsageTotals;
  defaultSortedBy?: SortableKeys;
  defaultSortedDirection?: 'asc' | 'desc';
}> = ({ data, totals, defaultSortedBy = 'title', defaultSortedDirection = 'asc' }) => {
  const [sortBy, setSortBy] = useState<SortableKeys>(defaultSortedBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortedDirection);
  const [isClientSorted, setIsClientSorted] = useState(false);

  const handleSortChange = (column: SortableKeys, direction: 'asc' | 'desc') => {
    setSortBy(column);
    setSortDirection(direction);
    setIsClientSorted(true);
  };

  const sortedData = useMemo(() => {
    if (!isClientSorted) {
      return data;
    }

    const sortableData = [...data];

    // Tie Breaking Sort: Always sort by title ascending as a secondary sort to ensure consistent order
    // The title column is much less likely to be repeated than collection or useCount, which makes it a good candidate for tie-breaking
    sortableData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      let primaryResult = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        primaryResult =
          sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        primaryResult = sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (primaryResult !== 0 || sortBy === 'title') {
        return primaryResult;
      }

      return a.title.localeCompare(b.title);
    });

    return sortableData;
  }, [data, sortBy, sortDirection, isClientSorted]);

  return (
    <div>
      <h3>
        <span className="field-label">Record Usage Tracking</span>
      </h3>
      <div className="field-description field-description-consumers">
        This record is consumed {totals.totalUses} times across {totals.totalConsumers} consumers in{' '}
        {totals.totalCollections} collections.
      </div>
      <div className="collection-list__tables">
        <div className="table-wrap">
          <div className="table">
            <table cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th id={`heading-${col.accessor}`} key={col.accessor}>
                      <div className="sort-column">
                        <span className="sort-column__label">
                          <span className="field-label unstyled">{col.label}</span>
                        </span>
                        <span className="sort-column__buttons">
                          <button
                            aria-label={`Sort by ${col.label} Ascending`}
                            className={cn('sort-column__asc sort-column__button', {
                              'sort-column--active':
                                sortBy === col.accessor && sortDirection === 'asc',
                            })}
                            type="button"
                            onClick={() => handleSortChange(col.accessor, 'asc')}
                          >
                            <ChevronIcon direction="up" />
                          </button>
                          <button
                            aria-label={`Sort by ${col.label} Descending`}
                            className={cn('sort-column__desc sort-column__button', {
                              'sort-column--active':
                                sortBy === col.accessor && sortDirection === 'desc',
                            })}
                            type="button"
                            onClick={() => handleSortChange(col.accessor, 'desc')}
                          >
                            <ChevronIcon direction="down" />
                          </button>
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => (
                  <tr className={`row-${index + 1}`} data-id={row.id} key={`row-${row.id}`}>
                    {COLUMNS.map((col) => (
                      <td className={`cell-${col.accessor}`} key={`${row.id}-${col.accessor}`}>
                        {col.accessor === 'title' ? (
                          <a href={row.href}>{row[col.accessor as SortableKeys]}</a>
                        ) : (
                          <span>{row[col.accessor as SortableKeys]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
