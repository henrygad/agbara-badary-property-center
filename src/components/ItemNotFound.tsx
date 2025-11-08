import React, { ReactNode } from 'react'

export default function ItemNotFound({children}: {children: ReactNode}) {
    return <div className="min-h-40 flex justify-center items-center">
        <p className="text-gray-400 font-medium text-base">{children}</p>
    </div>
}
