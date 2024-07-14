'use client';

import React, { ReactNode, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import TransactionDrawer from './transaction-drawer';
import Transaction from '@/types/transactions';
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
  createColumnHelper,
  flexRender,
  SortingState,
  getFilteredRowModel,
  ColumnDef,
  ColumnFiltersState,
  Row,
} from '@tanstack/react-table';

import { create } from 'zustand';
import Search from './search';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';

import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { object } from 'zod';

type TableColumn<T> = {
  key: keyof T;
  header: keyof T;
  render: (item: T) => ReactNode;
};

// customer filter function which gets set on the filterfn column prop and returns true if match found
const dateRangeFilter = (
  row: Row<Transaction>,
  columnId: string,
  filterValue: string[]
) => {
  const rowValue = row.getValue(columnId);

  return !!filterValue.find((x) => x === rowValue);
};

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
    console.log('matched dates', matchedDates);

    // columnFilter('name', data.name);
    console.log(' start date dirty', form.formState.dirtyFields.startDate);
    console.log('end date', form.formState.dirtyFields.endDate);
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

  const types = Array.from(new Set(data?.map((x) => x.name)));

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild onClick={() => setOpen(true)}>
          <Button variant='secondary' className='w-24 mt-2'>
            <SlidersHorizontal className='w-4 h-4' />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-full'>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className='w-full'>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='choose type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>choose name</SelectLabel>
                              {types?.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <DropdownMenuSeparator />

              <div className=' inline-flex gap-2'>
                <div className='flex flex-col '>
                  <Label className='mb-4' htmlFor='from'>
                    Date Range Start
                  </Label>
                  <FormField
                    control={form.control}
                    name='startDate'
                    render={({ field }) => (
                      <Input
                        className='w-48 h-12 px-4 py-3 rounded justify-center items-center gap-2 inline-flex'
                        {...field}
                        id='from'
                        type='date'
                      />
                    )}
                  />
                </div>
                <div className='flex flex-col '>
                  <Label className='mb-4' htmlFor='to'>
                    Date Range End
                  </Label>
                  <FormField
                    control={form.control}
                    name='endDate'
                    render={({ field }) => (
                      <Input
                        className='w-48 h-12 px-4 py-3 rounded justify-center items-center gap-2 inline-flex'
                        {...field}
                        id='to'
                        type='date'
                      />
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-2 mt-10'>
                <Button className='w-48' type='button' onClick={resetFilters}>
                  Clear Filters
                </Button>
                <Button type='submit' className='w-48'>
                  Apply Filters
                </Button>
              </div>
            </form>
          </Form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function SelectSingleCheckbox({ row }) {
  return (
    <input
      type='checkbox'
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  );
}

export function SelectAllCheckbox({ tableInstance }) {
  return (
    <input
      type='checkbox'
      checked={tableInstance.getIsAllRowsSelected()}
      onChange={tableInstance.getToggleAllRowsSelectedHandler()}
    />
  );
}

function TransactionTable() {
  const { data, isLoading } = useGetTransactions();

  const [checkedItems, setCheckItems] = useState<Transaction[]>([]);
  const [allchecked, setAllChecked] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<Transaction>();
  const [filtering, setFiltering] = useState('');

  const columns = useMemo<ColumnDef<Transaction, any>[]>(
    () => [
      columnHelper.display({
        id: 'selection',
        header: () => <SelectAllCheckbox tableInstance={tableInstance} />,
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

  const tableInstance = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      sorting,
      globalFilter: filtering,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnFiltersChange: setColumnFilters,
    //order doesn't matter anymore!
    // etc.
  });

  // console.log({ selectedRows: tableInstance.getSelectedRowModel() });

  const rowData = () => data && tableInstance.getRowModel().rows;

  const row = rowData();

  const toggleCheckItems = (item: Transaction) => {
    if (checkedItems.some((x) => x.ID === item.ID)) {
      setCheckItems(checkedItems.filter((x) => x.ID !== item.ID));
    } else {
      setCheckItems([...checkedItems, item]);
    }
  };

  const handleFilterItem = (item: Transaction) => {
    setCheckItems(checkedItems.filter((x) => x.ID === item.ID));
  };

  const handleCheckAllItems = () => {
    if (!allchecked) {
      setAllChecked(true);
      setCheckItems(data || []);
    } else {
      setAllChecked(false);
      setCheckItems([]);
    }
  };

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

  if (data === undefined) {
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
      <Button onClick={() => tableInstance.resetColumnFilters()}>
        reset column filters
      </Button>

      {tableInstance.getAllColumns().map((column) => {
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

      <Table className='w-full ml-4 border-collapse divide-y divide-gray-400 text-xs'>
        <TableCaption>Monzo</TableCaption>

        <TableHeader>
          {tableInstance.getHeaderGroups().map((headerGroup) => (
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
