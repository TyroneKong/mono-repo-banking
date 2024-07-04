'use client';

import React, { ReactNode, useState } from 'react';
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
} from '@tanstack/react-table';

import { create } from 'zustand';

type TableColumn<T> = {
  key: keyof T;
  header: keyof T;
  render: (item: T) => ReactNode;
};

// TODO: refactor tables and split up components and use real data

// const columns: TableColumn<Transaction>[] = [
//   { key: 'ID', header: 'ID', render: (t) => t.ID },
//   { key: 'ID', header: 'user_id', render: (t) => t.user_id },
//   { key: 'ID', header: 'name', render: (t) => t.name.toUpperCase() },
//   { key: 'ID', header: 'amount', render: (t) => t.amount },
//   { key: 'ID', header: 'balance', render: (t) => t.balance },
//   { key: 'ID', header: 'currency', render: (t) => t.currency },
//   { key: 'ID', header: 'type', render: (t) => t.type.toUpperCase() },
//   { key: 'ID', header: 'createdate', render: (t) => t.createdate },
// ];

function TransactionTable() {
  const { data, isLoading } = useGetTransactions();

  const [checkedItems, setCheckItems] = useState<Transaction[]>([]);
  const [allchecked, setAllChecked] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Transaction>();

  const columns = [
    columnHelper.display({
      id: 'selection',
      header: () => (
        <input
          type='checkbox'
          checked={tableInstance.getIsAllRowsSelected()}
          onChange={tableInstance.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type='checkbox'
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
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
    }),
    columnHelper.accessor('currency', {
      id: 'currency',
      header: 'Currency',
    }),
  ];

  const tableInstance = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,

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

  //   const columns2 = data?.map((t) => (t) => {
  //     ({ key: t.ID, header: t, render: (t) => t });
  //   });

  type myReadOnly<T, K extends keyof T> = { readonly [P in K]: T[P] };
  const queryClient = useQueryClient();

  const deleteTransaction = useMutation({
    mutationFn: (id: string) => axAPI.delete(`/api/deleteTransaction/${id}`),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });

  return (
    <div className='flex flex-col '>
      <header className='text-center text-2xl font-bold'>Monzo</header>
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
                  onClick={() => header.column.getToggleSortingHandler()}
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

          {/* <TableRow>
            {columns?.map((col) => (
              <TableHead key={col.header}>{col.header}</TableHead>
            ))}            
          </TableRow> */}
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
          {/* {tableInstance?.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))} */}

          {/* {data?.data.map((item) => {
            const color = item.type === 'withdrawal' ? 'red' : 'green';
            return (
              <TableRow key={item.ID} style={{ color }}>
                <td>
                  <Checkbox
                    onCheckedChange={() => toggleCheckItems(item)}
                    id='terms'
                    checked={allchecked}
                  />
                </td>

                {columns.map((col) => (
                  <TableCell key={col.header}>{col.render(item)}</TableCell>
                ))}
                <td>
                  <Button
                    style={{ color: 'red' }}
                    onClick={() => deleteTransaction.mutate(item.ID as string)}
                  >
                    Remove
                  </Button>
                </td>
              </TableRow>
            );
          })} */}
        </TableBody>
      </Table>
      <TransactionDrawer />
    </div>
  );
}

export default TransactionTable;
