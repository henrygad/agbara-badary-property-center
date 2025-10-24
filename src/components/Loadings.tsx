import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';



export const UploadingImageLoading = ({ className }: { className?: string }) => {
    return <div
        className={cn("flex items-center justify-center bg-gray-100 animate-pulse", className)}
    >
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
    </div>
}


export default function PageLoading({ loading, children }: { loading: boolean, children?: ReactNode }) {
    return loading ?
        <div className='w-full h-[90vh] flex-1 flex justify-center items-center'>
            {children || "Loading...."}
        </div> :
        null;
};

