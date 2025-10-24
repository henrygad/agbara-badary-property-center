import { Button } from './ui/button';

type Props = { onClick?: () => void, type?: "button" | "reset" | "submit", disabled?: boolean, children: React.ReactNode }

export default function CustomButton({ onClick = () => null, type = "submit", disabled, children }: Props) {
    return <Button       
        type={type}
        className="bg-primary hover:bg-red-600 text-white text-base px-16 py-3 rounded-md shadow  w-full overflow-hidden cursor-pointer"
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </Button>
}
