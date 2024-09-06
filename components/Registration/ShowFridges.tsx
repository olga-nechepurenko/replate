import prisma from "@/prisma/db";
import Link from "next/link";

export default async function ShowFridges({ email }: { email: string }) {
    const profile = await prisma.user.findUnique({
        where: {
            email,
        },
        include: {
            Location: true,
        },
    });

    if (!profile) {
        return <></>;
    }

    const fridges = await prisma.fridge.findMany({
        where: {
            userId: profile.id,
        },
    });

    if (!fridges || fridges.length === 0) {
        return;
    }

    if (fridges.length > 1) {
        return (
            <>
                <Link href={`/fridges/${profile.id}`}>
                    zur meinen Kühlschränken
                </Link>
            </>
        );
    }

    return (
        <>
            <h3>3. Füge die Produkte hinzu:</h3>
            <Link href={`/fridge/${fridges[0].id}`}>
                Produkte zum shared Kühlschrank hinzufügen
            </Link>
        </>
    );
}
