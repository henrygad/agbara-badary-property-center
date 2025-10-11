"use client";

const useAutoNavigate = () => {
    const autoNavigate = (target: HTMLElement | null) => {
        if (!target) return;        

        const targetPositionY = target.getBoundingClientRect().top;
        const currentPostionY = window.pageYOffset;
        const distance: number = currentPostionY + targetPositionY - 100; 

        window.scroll({ top: distance, behavior: "smooth" });
        return () => {
            window.scrollTo({ top: distance, behavior: "smooth" });
        };
    };

    return autoNavigate;
};

export default useAutoNavigate;

