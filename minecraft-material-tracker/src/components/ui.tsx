import { cn } from '../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-emerald-600 text-white hover:bg-emerald-700': variant === 'default',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700':
            variant === 'secondary',
          'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800':
            variant === 'outline',
          'hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
          'h-10 w-10': size === 'icon',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
        'ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-gray-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-950 dark:placeholder:text-gray-400',
        className
      )}
      {...props}
    />
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
        'ring-offset-white placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-950 dark:placeholder:text-gray-400',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm',
        'dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</div>;
};

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <h3
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    >
      {children}
    </h3>
  );
};

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
};

export const Badge: React.FC<{
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  children: React.ReactNode;
}> = ({ variant = 'default', className, children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200':
            variant === 'success',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
            variant === 'warning',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': variant === 'danger',
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  );
};

export const Progress: React.FC<{ value: number; className?: string }> = ({
  value,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800',
        className
      )}
    >
      <div
        className="h-full bg-emerald-600 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
