"use client";
import { useFormState } from "react-dom";
//import classes from "./PetitionForm.module.css";

import { useEffect, useRef, useState } from "react";
import SubmitButton from "../SubmitButton";
import { addUser } from "./registrationServerActions";
import LocationSearch from "./LocationSearch";
import type { LatLng } from "@/types/location-types";

export default function RegistratingForm() {
    const formRef = useRef<HTMLFormElement>(null!);
    const [formState, formAction] = useFormState(addUser, {
        message: "",
        status: "",
    });

    const [userLocation, setUserLocation] = useState<LatLng | null>(null);

    /* Nutzt useEffect, um das Formularelement mit der Formularmethode
	reset() zurückzusetzen, falls der Status in formState "success" ist. */
    useEffect(() => {
        if (formState.status === "success") {
            formRef.current.reset();
        }
    }, [formState]);

    return (
        <>
            <form action={formAction} ref={formRef}>
                <div>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            maxLength={100}
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">E-Mail</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div>
                        {/* <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            name="location"
                            maxLength={5}
                            required
                        /> */}

                        <LocationSearch setUserLocation={setUserLocation} />
                    </div>
                    <div>
                        <label htmlFor="bio">Über mich</label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={5}
                            cols={10}
                            maxLength={500}
                            defaultValue={""}
                        />
                    </div>
                </div>
                <label>
                    <input
                        type="checkbox"
                        name="privacy"
                        value="accept"
                        required
                    />
                    Ich stimme den Datenschutzbedingungen zu
                </label>
                <SubmitButton
                    readyContent={<strong>Profil erstellen!</strong>}
                />
                <strong>{formState.message}</strong>
            </form>
        </>
    );
}
