import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
      <input
        ref={ref}
        className={cn(
          'w-full bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500',
          'px-3 py-2.5 outline-none transition-all duration-150',
          'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
          icon && 'pl-9',
          error && 'border-red-500/50 focus:border-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
))
Input.displayName = 'Input'
