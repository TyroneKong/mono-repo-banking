import Transaction from '@/types/transactions';
import { Row } from '@tanstack/react-table';
import { isWithinInterval } from 'date-fns';

export const dateRangeFilter = (
  row: Row<Transaction>,
  columnId: string,
  filterValue: string[]
) => {
  const rowValue = row.getValue(columnId);

  return !!filterValue.find((x) => x === rowValue);
};
