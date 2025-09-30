import { ReactElement } from "react";

type Props = {
    type: "submit" | "reset" | "button" | undefined, children: ReactElement | string,
    className?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    disabled?: boolean
};
const CustomButton = ({ type, children, className, onClick = () => null, disabled }: Props) => {
    return <button
        type={type}
        className={`text-sm font-medium px-4 py-2 mr-2 cursor-pointer shadow ${className || ""}`}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>;
};

export default CustomButton;