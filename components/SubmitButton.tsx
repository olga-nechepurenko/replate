"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type Props = {
    readyContent?: ReactNode;
    pendingContent?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export default function SubmitButton({
    readyContent = "Absenden",
    pendingContent = "Warten…",
    ...atts
}: Props) {
    const { pending } = useFormStatus();

    /*
Der Button soll disabled sein, wenn pending true ist.
Im Button soll als default "Absenden" oder "Warten…" stehen, je
nachdem, ob pending false oder true ist.
Der Inhalt des Buttons soll aber konfigurierbar sein,  nutzt
dafür zwei Props: readyContent und pendingContent. Diese sollen
alles enthalten können, was in React dargestellt werden kann.
Bonus: Der Button soll alle erlaubten Attribute erhalten können.
*/

    return (
        <button type="submit" disabled={pending} {...atts}>
            {pending ? pendingContent : readyContent}
        </button>
    );
}
