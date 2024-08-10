'use client';

import React, { useState } from 'react';

import { useGetTransactions } from '@/app/hooks/requests';

import { isWithinInterval } from 'date-fns';

import { SubmitHandler, useForm } from 'react-hook-form';

import FormSelect from '../../../ui/atoms/form-select';
import FormInput from '@/ui/atoms/form-input';

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
        <FormSelect label='name' name='name' types={types} />
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

export default SelectComponet;
