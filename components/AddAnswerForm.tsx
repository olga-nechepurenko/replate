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
import { sendMessage } from "./transactionServerActions";

type Props = {
    foodItemId: number;
    senderId: number;
    recieverId: number;
    messageId: number;
};

export default function AddAnswerForm({
    foodItemId,
    senderId,
    recieverId,
    messageId,
}: Props) {
    const [formVisible, setFormVisible] = useState(false);

    console.log(foodItemId, senderId, recieverId, messageId);

    const handleOpenClick = async () => {
        setFormVisible(true);
    };

    const formRef = useRef<HTMLFormElement>(null!);
    const [formState, formAction] = useFormState(sendMessage, {
        message: "",
        status: "",
    });

    useEffect(() => {
        if (formState.status === "success") {
            formRef.current.reset();
            setFormVisible(false);
        }
    }, [formState]);

    return (
        <>
            <article className="form-full">
                {formVisible ? (
                    <div className="add-fridge-form">
                        <form action={formAction} ref={formRef}>
                            {formState.status !== "success" && (
                                <div>
                                    <input
                                        id="foodItemId"
                                        name="foodItemId"
                                        type="hidden"
                                        value={foodItemId}
                                        required
                                    />
                                    <input
                                        id="messageId"
                                        name="messageId"
                                        type="hidden"
                                        value={messageId}
                                        required
                                    />
                                    <input
                                        id="senderId"
                                        name="senderId"
                                        type="hidden"
                                        value={senderId}
                                        required
                                    />
                                    <input
                                        id="recieverId"
                                        name="recieverId"
                                        type="hidden"
                                        value={recieverId}
                                        required
                                    />
                                    <div>
                                        <label htmlFor="content">
                                            Antwort:
                                        </label>
                                        <textarea
                                            id="content"
                                            name="content"
                                            rows={5}
                                            cols={10}
                                            maxLength={500}
                                            defaultValue={""}
                                        />
                                    </div>
                                </div>
                            )}
                            {formState.status !== "success" && (
                                <SubmitButton
                                    readyContent={<strong>Absenden</strong>}
                                    pendingContent={<strong>Sende ab…</strong>}
                                />
                            )}
                            <strong>{formState.message}</strong>
                        </form>
                    </div>
                ) : (
                    <button onClick={handleOpenClick}>Antworten</button>
                )}
            </article>
        </>
    );
}
