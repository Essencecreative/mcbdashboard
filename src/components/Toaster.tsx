import { useToast } from "../hooks/use-toast" // your toast state file
import { cn } from "../lib/utils" // optional: for styling utility
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-background text-foreground shadow-md rounded-md p-4 w-[300px] flex justify-between items-start border",
            toast.open ? "animate-fade-in" : "animate-fade-out"
          )}
        >
          <div className="flex-1">
            {toast.title && <div className="font-medium">{toast.title}</div>}
            {toast.description && <div className="text-sm mt-1">{toast.description}</div>}
          </div>
          <button onClick={() => dismiss(toast.id)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
