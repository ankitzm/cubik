import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const textareaVariants = cva(
  'flex h-[140px] md:h-40 w-full px-3 py-4 shrink-0 rounded-lg border placeholder:text-base',
  {
    variants: {
      size: {
        sm: 'input-sm',
        md: '',
      },
      state: {
        default:
          'bg-[var(--form-input-surface-default)] border border-[var(--form-input-border-default)] placeholder:text-[var(--form-input-placeholder-default)] focus-visible:ring-1 focus-visible:ring-[var(--form-input-border-focused)] focus-visible:ring-offset-0 focus-visible:outline-none focus:border-none focus-visible:border-none hover:border hover:border-[var(--form-input-border-hovered)] disabled:bg-[var(--form-input-surface-disabled)] disabled:border disabled:border-[var(--form-input-border-disabled)] disabled:placeholder:text-[var(--form-input-placeholder-disabled)] ',
        error:
          'bg-[var(--form-input-surface-error)] border-[var(--form-input-border-error)] placeholder:text-[var(--form-input-placeholder-error)]',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
);
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  resizable: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, state, resizable, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          className,
          !resizable && 'resize-none',
          textareaVariants({ size, state }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
