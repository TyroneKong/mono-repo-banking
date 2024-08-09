'use client';

import UseTransactionColumns from '@/app/components/transactions/atoms/columns';
import Search from '@/app/components/transactions/atoms/search';
import TransactionDrawer from '@/app/components/transactions/transaction-drawer';
import SelectComponet from '@/app/components/transactions/transactions';
import {
  axAPI,
  transactionKeys,
  useGetTransactions,
} from '@/app/hooks/requests';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { SetStateAction, useState } from 'react';

type PaginationType = {
  pageIndex: number;
  pageSize: number;
};

type TableType<TData> = {
  data: TData;
  columns: ColumnDef<TData, any>[];
  pagination: PaginationType;
  setPagination: React.Dispatch<SetStateAction<PaginationType>>;
  sorting: SortingState;
  setSorting: React.Dispatch<SetStateAction<SortingState>>;
  isManualPagination: boolean;
  pageSize: number;
  isLoading: boolean;
};

const Datatable = () => {
  const { data, isLoading } = useGetTransactions();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filtering, setFiltering] = useState('');
  const columns = UseTransactionColumns();

  const tableInstance = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // manualPagination: true,
    state: {
      sorting,
      globalFilter: filtering,
      columnFilters,
      pagination: pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  // console.log({ selectedRows: tableInstance.getSelectedRowModel() });

  const rowData = () => data && tableInstance.getRowModel().rows;

  const row = rowData();

  const filterColumnById = (id: string, value: string | string[]) => {
    const type = tableInstance.getAllColumns().filter((x) => x.id === id)[0];
    type.setFilterValue(value);
  };

  type myReadOnly<T, K extends keyof T> = { readonly [P in K]: T[P] };
  const queryClient = useQueryClient();

  const deleteTransaction = useMutation({
    mutationFn: (id: string) => axAPI.delete(`/api/deleteTransaction/${id}`),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });

  if (isLoading) {
    return <div>...loading</div>;
  }

  return (
    <div className='flex flex-col '>
      <SelectComponet
        columnFilter={filterColumnById}
        id='type'
        clearFilters={tableInstance.resetColumnFilters}
      />
      <header className='text-center text-2xl font-bold'>Monzo</header>
      <Search filter={filtering} setFilter={setFiltering} />
      {tableInstance.getAllColumns()?.map((column) => {
        return (
          <label key={column.id}>
            {column.id}
            <input
              checked={column.getIsVisible()}
              disabled={!column.getCanHide()}
              onChange={column.getToggleVisibilityHandler()}
              type='checkbox'
            />
          </label>
        );
      })}
      <div className='flex space-x-4 justify-end'>
        <Button variant='default' onClick={() => tableInstance.setPageIndex(0)}>
          first
        </Button>
        <Button
          disabled={!tableInstance.getCanPreviousPage()}
          variant='default'
          onClick={() => tableInstance.previousPage()}
        >
          previous
        </Button>
        <Button
          disabled={!tableInstance?.getCanNextPage()}
          variant='default'
          onClick={() => tableInstance.nextPage()}
        >
          Next
        </Button>
        <Button onClick={() => tableInstance.lastPage()} variant='default'>
          Last
        </Button>
      </div>

      <Table className='w-full ml-4 border-collapse divide-y divide-gray-400 text-xs'>
        <TableCaption>Monzo</TableCaption>

        <TableHeader>
          {tableInstance?.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className='text-left cursor-pointer'
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: '🔼',
                    desc: '🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {row?.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
                <td>
                  <Button
                    onClick={() => deleteTransaction.mutate(row.getValue('ID'))}
                  >
                    Delete
                  </Button>
                </td>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <TransactionDrawer />
    </div>
  );
};

export default Datatable;
