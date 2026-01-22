import React, { useEffect, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { registryApi } from "../services/api";
import { useNavigate } from "react-router-dom";

const DeleteArtwork = ({ artwork }) => {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        if (open) {
            document.addEventListener("keydown", onKey);
            setTimeout(() => dialogRef.current?.focus(), 0);
        }
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    const handleConfirm = async () => {
        setOpen(false);
        await registryApi.deleteById(artwork.id);
        navigate('/registry');
    };

    return (
        <section className="w-full bg-white pb-10">
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-10 px-20 items-start justify-items-stretch">
                {/* 左侧：描述 */}
                <aside className="justify-self-start items-start">
                    <h2 className="font-serif text-[4rem] leading-none text-slate-700">
                        Remove from registry
                    </h2>
                    <p className="mt-2 text-slate-500 max-w-prose">
                        This will remove the artwork from your registry and delist it from the marketplace.
                    </p>
                </aside>

                {/* 右侧：按钮 */}
                <div className="w-full">
                    <div className="flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="mt-8 w-full font-serif py-3 
                            inline-flex items-center justify-center gap-2
                            !border !border-red-600
                         text-red-600 hover:bg-red-50 transition-colors duration-300 ease-in-out"
                            style={{ borderRadius: 0 }}
                        >
                            <FiTrash2 className="text-lg" />
                            Delete the artwork
                        </button>
                    </div>
                </div>
            </div>

            {/* 确认弹窗 */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50"
                    aria-hidden={!open}
                >
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-dialog-title"
                        tabIndex={-1}
                        className="bg-white p-6 rounded shadow-lg max-w-md w-full outline-none text-center"
                    >
                        <h2 id="delete-dialog-title" className="text-lg font-serif mb-3 text-slate-800">
                            Confirm deletion
                        </h2>

                        <p className="font-sans text-body-text mb-2">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{artwork?.title || "this artwork"}</span> from your
                            registry?This action will also delist it from the marketplace.
                        </p>
                        
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                className="border-button-primary text-body-text bg-white font-sans px-4 py-2
                     hover:bg-slate-50 transition-colors duration-300 ease-in-out inline-flex items-center justify-center"
                                style={{ borderRadius: 0, border: "1px solid" }}
                                onClick={() => setOpen(false)}
                            >
                                <span className="inline-flex items-center gap-2">Cancel</span>
                            </button>

                            <button
                                className="bg-button-primary text-white font-serif px-4 py-2
                     hover:bg-button-primary-hover transition-colors duration-300 ease-in-out inline-flex items-center justify-center"
                                style={{ borderRadius: 0 }}
                                onClick={handleConfirm}
                            >
                                <span className="inline-flex items-center gap-2">Confirm</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default DeleteArtwork;
