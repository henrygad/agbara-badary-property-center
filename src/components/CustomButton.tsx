import { Button } from './ui/button';

import { cn } from '../lib/utils';

type Props = {
    onClick?: () => void,
    type?: "button" | "reset" | "submit",
    disabled?: boolean,
    children: React.ReactNode
    className?: string
}

export default function CustomButton({ className, onClick = () => null, type = "submit", disabled, children }: Props) {
    return <Button       
        type={type}
        className={cn(className, "text-base px-16 py-3 rounded-md shadow  w-full overflow-hidden cursor-pointer")}
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </Button>
}
