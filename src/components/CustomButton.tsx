import React, { ReactElement } from 'react'
import { Button } from './ui/button';

type Props = { onClick?: () => void, disabled: boolean, children: ReactElement }
export default function CustomButton({ onClick = () => null, disabled, children }: Props) {
    return <Button       
        type='submit'    
        className="bg-green-800 dark:bg-green-800 hover:bg-blue-600 text-white hover:text-white text-base px-16 py-3 rounded-2xl shadow border max-w-[280px] overflow-hidden cursor-pointer"
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </Button>
}
