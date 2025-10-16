import React, { ReactElement } from 'react'
import { Button } from './ui/button';

type Props = { onClick?: () => void, disabled: boolean, children: ReactElement }
export default function CustomButton({ onClick = () => null, disabled, children }: Props) {
    return <Button        
        className="bg-green-800 dark:bg-green-800 hover:bg-blue-600 text-white hover:text-white text-base px-20 md:px-24 py-5 md:py-6 rounded-2xl shadow border max-w-[280px] overflow-hidden cursor-pointer"
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </Button>
}
