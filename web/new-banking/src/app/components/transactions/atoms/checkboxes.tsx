import Transaction from '@/types/transactions';
import { Row, Table } from '@tanstack/react-table';

type SelectSingleChecboxType<TData> = {
  row: Row<TData>;
};

type SelectAllCheckboxType<TData> = {
  tableInstance: Table<TData>;
};

export function SelectSingleCheckbox({
  row,
}: SelectSingleChecboxType<Transaction>) {
  return (
    <input
      type='checkbox'
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  );
}

export function SelectAllCheckbox({
  tableInstance,
}: SelectAllCheckboxType<Transaction>) {
  return (
    <input
      type='checkbox'
      checked={tableInstance.getIsAllRowsSelected()}
      onChange={tableInstance.getToggleAllRowsSelectedHandler()}
    />
  );
}
