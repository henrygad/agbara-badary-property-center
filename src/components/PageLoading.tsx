import { ReactElement } from 'react';

export default function PageLoading({ loading, children }: { loading: boolean, children?: ReactElement }) {
    return loading ?
        <div className='flex flex-1 justify-center items-center'>
            {children || "Loading...."}
        </div> :
        null;
};

