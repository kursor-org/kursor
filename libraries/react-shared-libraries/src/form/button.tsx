'use client';

import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { clsx } from 'clsx';
import ReactLoading from 'react-loading';

export const Button: FC<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { secondary?: boolean; loading?: boolean; innerClassName?: string }
> = ({ children, loading, innerClassName, ...props }) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    setHeight(ref.current?.offsetHeight || 40);
  }, []);

  return (
    <button
      {...props}
      type={props.type || 'button'}
      ref={ref}
      className={clsx(
        (props.disabled || loading) && 'pointer-events-none opacity-50',
        `relative flex h-[40px] cursor-pointer items-center justify-center border px-[24px]`,
        props?.className,
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ReactLoading
            type="spin"
            color="#fff"
            width={height! / 2}
            height={height! / 2}
          />
        </div>
      )}
      <div
        className={clsx(
          innerClassName,
          'flex flex-1 items-center justify-center',
          loading && 'invisible',
        )}
      >
        {children}
      </div>
    </button>
  );
};
