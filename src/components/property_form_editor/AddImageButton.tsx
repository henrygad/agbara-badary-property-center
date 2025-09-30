import React from 'react'

export default function AddImageButton({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> | undefined }){
    return <div className="w-[100px] h-[100px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center text-gray-500 hover:border-gray-400">
        <button
            type="button"
            className="px-3 py-1 text-sm rounded bg-blue-600 text-white cursor-pointer"
            onClick={onClick}
        >
            +
        </button>
    </div>
};
