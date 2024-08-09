import Transaction from '@/types/transactions';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { dateRangeFilter } from '../transaction-props';
import { SelectAllCheckbox, SelectSingleCheckbox } from './checkboxes';

const UseTransactionColumns = () => {
  const columnHelper = createColumnHelper<Transaction>();

  const columns = useMemo<ColumnDef<Transaction, any>[]>(
    () => [
      columnHelper.display({
        id: 'selection',
        header: ({ table }) => <SelectAllCheckbox tableInstance={table} />,
        cell: ({ row }) => <SelectSingleCheckbox row={row} />,
      }),
      columnHelper.accessor('ID', {
        id: 'ID',
        header: 'ID',
      }),
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
      }),
      columnHelper.accessor('amount', {
        id: 'amount',
        header: 'Amount',
      }),
      columnHelper.accessor('balance', {
        id: 'balance',
        header: 'Balance',
      }),
      columnHelper.accessor('createdate', {
        id: 'createdate',
        header: 'CreateDate',
        size: 1,
        filterFn: dateRangeFilter,
      }),
      columnHelper.accessor('currency', {
        id: 'currency',
        header: 'Currency',
        size: 8,
      }),
    ],
    []
  );
  return columns;
};

export default UseTransactionColumns;
