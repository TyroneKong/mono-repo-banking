import { FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = {
  label: string;
  type: string;
  name: string;
};

const FormInput = ({ label, type, name }: FormInputProps) => {
  const { control } = useFormContext();
  return (
    <div className='flex flex-col'>
      <FormLabel className='mb-4' htmlFor='to'>
        {label}
      </FormLabel>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            className='h-12 px-4 py-3 rounded justify-center items-center gap-2 inline-flex'
            {...field}
            id='to'
            type={type}
          />
        )}
      />
    </div>
  );
};

export default FormInput;
