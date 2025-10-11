import { useCallback } from 'react';

const useDownloadFile = () => {
    const downloadFile = useCallback((url: string, filename: string) => {
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }, []);

    return { downloadFile };
};

export default useDownloadFile;
