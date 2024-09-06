import { auth } from "@/auth";
import { userInDb } from "@/components/Registration/registrationServerActions";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Neuer Kühlschrank anlegen",
};

export default async function NewFridgePage() {
    const session = await auth();
    if (!session) {
        redirect("/");
    }

    const userProfile = await userInDb(session?.user?.email);
    if (!userProfile) {
        redirect("/profile/new");
    }

    return (
        <div>
            <h1>neue Kühlschrank anlegen</h1>
        </div>
    );
}
