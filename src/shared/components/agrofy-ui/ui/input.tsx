"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/shared/utils/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

interface SearchBarProps {
  placeholder?: string
  showActiveUsersFilter?: boolean
  onActiveUsersChange?: (checked: boolean) => void
  className?: string
}

function SearchBar({
  placeholder = "Cari pasien",
  showActiveUsersFilter = true,
  onActiveUsersChange,
  className,
}: SearchBarProps) {
  const [activeUsersOnly, setActiveUsersOnly] = React.useState(false)

  const handleActiveUsersChange = (checked: boolean) => {
    setActiveUsersOnly(checked)
    onActiveUsersChange?.(checked)
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {showActiveUsersFilter && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="activeUsers"
            checked={activeUsersOnly}
            onChange={(e) => handleActiveUsersChange(e.target.checked)}
            className="w-4 h-4 text-[#5D87FF] border-gray-300 rounded focus:ring-[#5D87FF] focus:ring-2"
          />
          <label htmlFor="activeUsers" className="text-sm text-gray-600 whitespace-nowrap">
            Hanya lihat user yang aktif
          </label>
        </div>
      )}

      <div className="relative flex-1 max-w-64">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={placeholder}
          className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D87FF] focus:border-transparent bg-white w-full"
        />
      </div>
    </div>
  )
}

export { Input, SearchBar }
