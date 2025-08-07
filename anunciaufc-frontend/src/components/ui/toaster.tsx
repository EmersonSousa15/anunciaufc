import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, icon, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="w-full flex flex-col items-center justify-center">
              {icon && <img className="mb-2" src={icon}/>}
              {title && <ToastTitle className="font-bold text-lg mb-3">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-[#535862] text-[12px] text-justify">{description}</ToastDescription>
              )}
              {action}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
