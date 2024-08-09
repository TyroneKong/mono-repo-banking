import React, { PropsWithChildren } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { SlidersHorizontal } from 'lucide-react';

type FormFilterProps<TValue extends FieldValues> = {
  form: UseFormReturn<TValue>;
  onSubmit: SubmitHandler<TValue>;
  resetFilters: () => void;
};

const FormFilter = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  resetFilters,
}: PropsWithChildren<FormFilterProps<T>>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' className='w-24 mt-2'>
          <SlidersHorizontal className='w-4 h-4' />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-full'>
        <DropdownMenuLabel>Columns</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DropdownMenuSeparator />
            {children}
            <div className='flex gap-2 mt-10'>
              <Button className='w-48' type='button' onClick={resetFilters}>
                Clear Filters
              </Button>
              <Button type='submit' className='w-48'>
                Apply Filters
              </Button>
            </div>
          </form>
        </FormProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FormFilter;
