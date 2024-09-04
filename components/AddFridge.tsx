"use client";
import { useFormState } from "react-dom";
//import classes from "./PetitionForm.module.css";

import { useEffect, useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
//import { addUser } from "/registrationServerActions";
//import LocationSearch from "./components/Registration/LocationSearch.tsx";
import type { LatLng } from "@/types/location-types";
import { IoCheckboxOutline } from "react-icons/io5";
import { revalidatePath } from "next/cache";
import Link from "next/link";

import { IoAddCircleOutline } from "react-icons/io5";
import { addFridge } from "./productServerActions";
import LocationSearch from "./Registration/LocationSearch";

type Props = {
    profileId: number;
};

//export default function AddFridge({ email = "", user, edit = false }: Props) {
export default function AddFridge({ profileId }: Props) {
    const [formVisible, setFormVisible] = useState(false);

    const handleOpenClick = async () => {
        setFormVisible(true);
    };

    const formRef = useRef<HTMLFormElement>(null!);
    const [formState, formAction] = useFormState(addFridge, {
        message: "",
        status: "",
    });

    // const id = user?.id;
    const [fridgeLocation, setFridgeLocation] = useState<LatLng | null>(null);

    /* Nutzt useEffect, um das Formularelement mit der Formularmethode
	reset() zurückzusetzen, falls der Status in formState "success" ist. */
    useEffect(() => {
        if (formState.status === "success") {
            //formRef.current.reset();
            setFridgeLocation(null);
        }
    }, [formState]);

    return (
        <>
            <article className="product-teaser">
                {formVisible ? (
                    <div className="add-fridge-form">
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
                                    <div>
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
                                    readyContent={
                                        <strong>
                                            mein Kühlschrank hinzufügen
                                        </strong>
                                    }
                                />
                            )}

                            <strong>{formState.message}</strong>
                        </form>
                    </div>
                ) : (
                    <Link href="" onClick={handleOpenClick}>
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
