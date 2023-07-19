import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export type Variant = 'planned' | 'ongoing' | 'done' | 'outline';
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        planned:
          'border-transparent text-orange-300 outline outline-none hover:outline-orange-300',
        ongoing:
          'border-transparent text-sky-300 outline outline-none hover:outline-sky-300',
        done: 'border-transparent text-green-500 outline outline-none hover:outline-green-500',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
