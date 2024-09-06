"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import type { LatLng } from "@/types/location-types";
import Link from "next/link";
import { IoAddCircleOutline } from "react-icons/io5";
import { addFridge } from "./productServerActions";
import LocationSearch from "./Registration/LocationSearch";

type Props = {
    profileId: number;
};

export default function AddFridge({ profileId }: Props) {
    const [formVisible, setFormVisible] = useState(false);

    const handleOpenClick = async () => {
        setFormVisible(true);
    };

    const [formState, formAction] = useFormState(addFridge, {
        message: "",
        status: "",
    });

    const [fridgeLocation, setFridgeLocation] = useState<LatLng | null>(null);
    const formRef = useRef<HTMLFormElement>(null!);
    /* Nutzt useEffect, um das Formularelement mit der Formularmethode
	reset() zurückzusetzen, falls der Status in formState "success" ist. */
    useEffect(() => {
        if (formState.status === "success") {
            formRef.current.reset();
            setFridgeLocation(null);
            setFormVisible(false);
            window.location.reload();
        }
    }, [formState]);

    return (
        <>
            <article className="product-teaser">
                {formVisible ? (
                    <div className="add-one-fridge-form">
                        <h4>Kühlschrank hinzufügen:</h4>
                        <form action={formAction} ref={formRef}>
                            {formState.status !== "success" && (
                                <div>
                                    <input
                                        type="hidden"
                                        name="lat"
                                        value={fridgeLocation?.lat}
                                    />
                                    <input
                                        type="hidden"
                                        name="lng"
                                        value={fridgeLocation?.lng}
                                    />
                                    <div className="input-name">
                                        <label htmlFor="name">Titel</label>
                                        <input
                                            id="name"
                                            name="name"
                                            maxLength={100}
                                            autoComplete="name"
                                            required
                                        />
                                    </div>
                                    <input
                                        id="profileId"
                                        name="profileId"
                                        type="hidden"
                                        value={profileId}
                                        required
                                    />
                                    <div>
                                        <LocationSearch
                                            setUserLocation={setFridgeLocation}
                                        />
                                    </div>
                                </div>
                            )}
                            {formState.status !== "success" && (
                                <SubmitButton
                                    className="add-button"
                                    readyContent={
                                        <strong>Kühlschrank hinzufügen</strong>
                                    }
                                />
                            )}

                            <strong>{formState.message}</strong>
                        </form>
                    </div>
                ) : (
                    <Link href="" onClick={handleOpenClick} scroll={false}>
                        <h4>Kühlschrank hinzufügen</h4>
                        <h2>
                            <IoAddCircleOutline />
                        </h2>
                    </Link>
                )}
            </article>
        </>
    );
}
