//"use client"

import { toast } from "sonner"
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react"

export const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
        description,
        icon: <CheckCircle2 className="text-green-600 w-5 h-5" />,
    })
}

export const showError = (message: string, description?: string) => {
    toast.error(message, {
        description,
        icon: <XCircle className="text-red-600 w-5 h-5" />,
    })
}

export const showInfo = (message: string, description?: string) => {
    toast(message, {
        description,
        icon: <Info className="text-blue-600 w-5 h-5" />,
    })
}

export const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
        description,
        icon: <AlertTriangle className="text-yellow-600 w-5 h-5" />,
    })
}
