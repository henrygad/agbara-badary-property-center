"use client";


import { useEffect, useState } from "react";
import useNavigate from "./useNavigate";


const useModal = () => {
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleModal = (modalIsOpen: boolean) => {
        if (modalIsOpen) {
            navigate("#");
        } else {
            navigate(-1);
        }
        setModalIsOpen(modalIsOpen);
    };


    useEffect(() => {

        const handlePopState = () => {
            if (modalIsOpen) {
                setModalIsOpen(false);
            }
        };

        if (modalIsOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        window.addEventListener("popstate", handlePopState);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("popstate", handlePopState);
        };
    }, [modalIsOpen]);


    return { modalIsOpen, handleModal };
};

export default useModal;