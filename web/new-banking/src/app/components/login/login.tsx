'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { axAPI } from '@/app/hooks/requests';
import FormInput from '@/ui/atoms/form-input';

const formSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((x) => x.password === x.confirmPassword, {
    path: ['confirmPassword'],
    message: 'passwords do not match',
  });

type Inputs = z.infer<typeof formSchema>;

export function LoginForm() {
  const form = useForm<Inputs>({
    reValidateMode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const router = useRouter();

  const { toast } = useToast();

  const login = useMutation({
    mutationKey: ['me'],
    mutationFn: (body: {
      username?: string;
      name?: string;
      email: string;
      password: string;
    }) =>
      axAPI.post('/api/login', body, {
        withCredentials: true,
      }),
    onSuccess: () => {
      toast({
        title: 'logged in',
        description: 'successfully logged in',
      });

      setTimeout(() => {
        router.push('/transactions');
      }, 3000);
    },
  });

  const onSubmit = (data: Inputs) => {
    login.mutate(data);
  };
  // ...

  const createAndDownload = () => {
    const data = [
      ['Name', 'Age'],
      ['John', 30],
      ['Jane', 25],
      ['Doe', 40],
    ];

    // const workbook = XLSX.utils.book_new();
    // const sheet = XLSX.utils.aoa_to_sheet(data);
    // XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

    // const execlBuffer = XLSX.write(workbook, {
    //   bookType: 'xlsx',
    //   type: 'array',
    // });

    const csvContent = data.map((row) => row.join(',')).join('\n');
    console.log(csvContent);
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  };

  return (
    <div>
      <Button onClick={createAndDownload}>download file</Button>
      <h1 className='text-4xl font-bold text-center mb-3'>Login</h1>
      <Card className='mb-5'>
        <Image src='/piggybank.jpg' alt='piggybank' width={400} height={400} />
      </Card>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormInput label='email' name='email' type='text' />
          <FormInput label='passwod' name='password' type='text' />
          <FormInput
            label='confirm password'
            name='confirmPassword'
            type='text'
          />
          <Button type='submit'>Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
}
