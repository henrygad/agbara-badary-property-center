"use client";

const useNavigate = () => {
    const navigate = (path: string | number) => {

        if (typeof window !== "undefined") {
            if (typeof path === "string") {
                window.history.pushState({}, "", path);
            }
            else if (typeof path === "number") {
                window.history.go(path);
                //window.history.back();
            }
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
    };

    return navigate;
};

export default useNavigate;
