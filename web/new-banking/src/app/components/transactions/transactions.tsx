'use client';

import React, { SetStateAction, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import TransactionDrawer from './transaction-drawer';

import {
  axAPI,
  transactionKeys,
  useGetTransactions,
} from '@/app/hooks/requests';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  getFilteredRowModel,
  ColumnDef,
  ColumnFiltersState,
} from '@tanstack/react-table';

import Search from './atoms/search';

import { isWithinInterval } from 'date-fns';

import { SubmitHandler, useForm } from 'react-hook-form';
import UseTransactionColumns from './atoms/columns';
import FormSelect from '../../../ui/atoms/form-select';
import FormInput from '@/ui/atoms/form-input';
import Transaction from '@/types/transactions';
import FormFilter from '@/ui/atoms/form-filter';

type SelectComponentProps = {
  columnFilter: (id: string, value: string | string[]) => void;
  id: string;
  clearFilters: () => void;
};

function SelectComponet({
  columnFilter,
  clearFilters,
  id,
}: SelectComponentProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetTransactions();

  const resetFields = () => {
    form.setValue('name', '');
    form.setValue('startDate', '');
    form.setValue('endDate', '');
  };
  const resetFilters = () => {
    resetFields();
    form.reset();

    clearFilters();
  };

  const form = useForm<{ name: string; startDate: string; endDate: string }>({
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
    },
  });

  // returns an array of dates that match
  const filterDates = (startDate: string, endDate: string) => {
    const filterDate = data?.filter((x) =>
      isWithinInterval(new Date(x.createdate), {
        start: startDate,
        end: endDate,
      })
    );

    return filterDate;
  };

  type FieldTypes = {
    name: string;
    startDate: string;
    endDate: string;
  };

  const onSubmitHandler: SubmitHandler<FieldTypes> = (data) => {
    const matchedDates = filterDates(data.startDate, data.endDate)?.map(
      (x) => x.createdate
    );

    if (form.formState.dirtyFields.name) {
      columnFilter('name', data.name);
    }
    if (
      form.formState.dirtyFields.startDate &&
      form.formState.dirtyFields.endDate &&
      matchedDates
    ) {
      columnFilter('createdate', matchedDates);
    }

    setOpen(false);
  };

  const types = Array.from(new Set(data?.map((x) => x.name))).map((name) => ({
    name: name,
    value: name,
  }));

  return (
    <FormFilter
      form={form}
      onSubmit={onSubmitHandler}
      resetFilters={resetFilters}
    >
      <div className='flex flex-col gap-4'>
        <FormSelect label='name' types={types} />
        <div className=' flex space-x-2'>
          <div className='flex flex-col '>
            <FormInput label='Date Range Start' name='startDate' type='date' />
          </div>
          <div className='flex flex-col '>
            <FormInput label='Date Range End' name='endDate' type='date' />
          </div>
        </div>
      </div>
    </FormFilter>
  );
}

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

function TransactionTable() {
  const { data, isLoading } = useGetTransactions();

  const [checkedItems, setCheckItems] = useState<Transaction[]>([]);
  const [allchecked, setAllChecked] = useState(false);
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
          disabled={!tableInstance.getCanNextPage()}
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
}

export default TransactionTable;
