import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  containerClassName?: string
  description?: string | React.ReactNode
}

export function FormField({
  label,
  error,
  containerClassName,
  className,
  id,
  description,
  ...props
}: FormFieldProps) {
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={cn("grid gap-3", containerClassName)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId}>{label}</Label>
        {description && (
          <div className="text-sm text-gray-500">
            {description}
          </div>
        )}
      </div>
      <Input
        id={inputId}
        className={cn(error && "border-red-500", className)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 