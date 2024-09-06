"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import SubmitButton from "../SubmitButton";
import { addUser } from "./registrationServerActions";
import LocationSearch from "./LocationSearch";
import type { LatLng } from "@/types/location-types";
import { IoCheckboxOutline } from "react-icons/io5";
import Link from "next/link";

type Props = {
    email: string;
    user: {
        id: number;
        username: string;
        email: string;
        profilePicture: string | null;
        defaultLocation: string;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
        locationId: number | null;
    } | null;
    edit: boolean;
};

export default function RegistratingForm({
    email = "",
    user,
    edit = false,
}: Props) {
    const formRef = useRef<HTMLFormElement>(null!);
    const [formState, formAction] = useFormState(addUser, {
        message: "",
        status: "",
    });

    const id = user?.id;
    const [userLocation, setUserLocation] = useState<LatLng | null>(null);

    useEffect(() => {
        if (formState.status === "success") {
            setUserLocation(null);
        }
    }, [formState]);

    return (
        <>
            {edit && <h1>Profil bearbeiten</h1>}
            {id !== undefined && !edit ? (
                <div>
                    <p>
                        <IoCheckboxOutline /> Dein profil wurde erfolgreich
                        hinzugefügt.
                    </p>
                    <Link href={`/profile/${id}`}>zum Profil</Link>
                </div>
            ) : (
                <form
                    className="registration-form"
                    action={formAction}
                    ref={formRef}
                >
                    {formState.status !== "success" && (
                        <>
                            <input
                                type="hidden"
                                name="lat"
                                value={userLocation?.lat}
                            />
                            <input
                                type="hidden"
                                name="lng"
                                value={userLocation?.lng}
                            />
                            <input
                                id="email"
                                name="email"
                                type="hidden"
                                value={email}
                                required
                            />

                            <div className="input-name">
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
                                <LocationSearch
                                    setUserLocation={setUserLocation}
                                />
                            </div>
                            <div className="input-name">
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
                        </>
                    )}
                    {formState.status !== "success" && (
                        <label>
                            <input
                                className="checkbox"
                                type="checkbox"
                                name="privacy"
                                value="accept"
                                required
                            />
                            Ich stimme den Datenschutzbedingungen zu
                        </label>
                    )}
                    {formState.status !== "success" && (
                        <SubmitButton
                            readyContent={<strong>Profil erstellen!</strong>}
                        />
                    )}

                    <strong>{formState.message}</strong>
                </form>
            )}
        </>
    );
}
