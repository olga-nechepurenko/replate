"use client";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import type { LatLng } from "@/types/location-types";
import { IoCheckboxOutline } from "react-icons/io5";
import { revalidatePath } from "next/cache";
import Link from "next/link";

import { IoAddCircleOutline } from "react-icons/io5";

import LocationSearch from "./Registration/LocationSearch";
import { addProduct } from "./productServerActions";

type Props = {
    fridgeId: number;
};

export default function AddProduct({ fridgeId }: Props) {
    const [formVisible, setFormVisible] = useState(false);

    const handleOpenClick = async () => {
        setFormVisible(true);
    };

    const formRef = useRef<HTMLFormElement>(null!);
    const [formState, formAction] = useFormState(addProduct, {
        message: "",
        status: "",
    });

    useEffect(() => {
        if (formState.status === "success") {
            formRef.current.reset();
            setFormVisible(false);
        }
    }, [formState]);

    useEffect(() => {
        if (formState.status === "success") {
            formRef.current.reset();
        }
    }, [formState]);

    return (
        <>
            <article className="add-product">
                {formVisible ? (
                    <div className="add-fridge-form">
                        <form action={formAction} ref={formRef}>
                            {formState.status !== "success" && (
                                <div>
                                    <div>
                                        <label htmlFor="name">Titel</label>
                                        <input
                                            id="name"
                                            name="name"
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <input
                                        id="fridgeId"
                                        name="fridgeId"
                                        type="hidden"
                                        value={fridgeId}
                                        required
                                    />
                                    <div>
                                        <label htmlFor="description">
                                            Beschreibung
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={5}
                                            cols={10}
                                            maxLength={500}
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="quantity">Mänge</label>
                                        <input
                                            id="quantity"
                                            name="quantity"
                                            min={1}
                                            type="number"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="expired">
                                            Ablaufdatum
                                        </label>
                                        <input
                                            id="expired"
                                            name="expired"
                                            type="date"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            {formState.status !== "success" && (
                                <SubmitButton
                                    readyContent={
                                        <strong>Produkt hinzufügen</strong>
                                    }
                                />
                            )}

                            <strong>{formState.message}</strong>
                        </form>
                    </div>
                ) : (
                    <Link
                        className="add-product__link"
                        href=""
                        onClick={handleOpenClick}
                    >
                        <h3>
                            <IoAddCircleOutline />
                        </h3>
                        <h5>Produkt hinzufügen</h5>
                    </Link>
                )}
            </article>
        </>
    );
}
