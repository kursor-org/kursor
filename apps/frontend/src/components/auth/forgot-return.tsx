'use client';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useFetch } from '@kursor/helpers/utils/custom.fetch';
import Link from 'next/link';
import { Button } from '@kursor/react/form/button';
import { Input } from '@kursor/react/form/input';
import { useMemo, useState } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ForgotReturnPasswordDto } from '@kursor/nestjs-libraries/dtos/auth/forgot-return.password.dto';

type Inputs = {
  password: string;
  repeatPassword: string;
  token: string;
};

export function ForgotReturn({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(false);

  const resolver = useMemo(() => {
    return classValidatorResolver(ForgotReturnPasswordDto);
  }, []);

  const form = useForm<Inputs>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      token,
    },
  });

  const fetchData = useFetch();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const { reset } = await (
      await fetchData('/auth/forgot-return', {
        method: 'POST',
        body: JSON.stringify({ ...data }),
      })
    ).json();

    setState(true);

    if (!reset) {
      form.setError('password', {
        type: 'manual',
        message: 'Your password reset link has expired. Please try again.',
      });

      return false;
    }
    setLoading(false);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h1 className="mb-4 cursor-pointer text-left text-3xl font-bold">
            Forgot Password
          </h1>
        </div>
        {!state ? (
          <>
            <div className="space-y-4">
              <Input
                label="New Password"
                {...form.register('password')}
                type="password"
                placeholder="Password"
              />
              <Input
                label="Repeat Password"
                {...form.register('repeatPassword')}
                type="password"
                placeholder="Repeat Password"
              />
            </div>
            <div className="mt-6 text-center">
              <div className="flex w-full">
                <Button type="submit" className="flex-1" loading={loading}>
                  Change Password
                </Button>
              </div>
              <p className="mt-4 text-sm">
                <Link href="/auth/login" className="cursor-pointer underline">
                  {' '}
                  Go back to login
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 text-left">
              We successfully reset your password. You can now login with your
            </div>
            <p className="mt-4 text-sm">
              <Link href="/auth/login" className="cursor-pointer underline">
                {' '}
                Go back to login
              </Link>
            </p>
          </>
        )}
      </form>
    </FormProvider>
  );
}
