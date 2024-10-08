import { auth } from "@/auth";
import FridgeTeaser from "@/components/FridgeTeaser";
import prisma from "@/prisma/db";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const revalidate = 3600;

type Props = {
    params: { profileId: string };
};
export default async function ProfilePage({ params: { profileId } }: Props) {
    const session = await auth();
    if (!session) {
        redirect("/");
    }
    const profile = await prisma.user.findUnique({
        where: {
            id: Number(profileId),
        },
        include: {
            Location: true,
            fridges: { include: { Location: true, foodItems: true } },
        },
    });

    if (!profile) {
        notFound();
    }

    return (
        <article>
            <h1>{profile.username}</h1>
            {profile.bio && <p>{profile.bio}</p>}
            <dl>
                <dt>Ort</dt>
                <dd>
                    <p>{profile.defaultLocation}</p>
                </dd>
                <dt>Erstellt am</dt>
                <dd>
                    <time
                        dateTime={profile.createdAt
                            .toISOString()
                            .substring(0, 10)}
                    >
                        {profile.createdAt.toLocaleDateString("de")}
                    </time>
                </dd>
                <dt>Letzte Aktualisierung</dt>
                <dd>
                    <time
                        dateTime={profile.updatedAt
                            .toISOString()
                            .substring(0, 10)}
                    >
                        {profile.updatedAt.toLocaleDateString("de")}
                    </time>
                </dd>
            </dl>
            {profile.fridges.length > 0 && (
                <>
                    <h3>
                        {profile.fridges.length === 1
                            ? "Meiner Kühlschrank"
                            : "Meine Kühlschränken"}
                    </h3>

                    <div className="product-teasers grid">
                        {profile.fridges.map((fridge) => (
                            <FridgeTeaser key={fridge.id} {...fridge} />
                        ))}
                    </div>
                </>
            )}
        </article>
    );
}

// Dynamische Metadaten erzeugen
export async function generateMetadata({
    params: { profileId },
}: Props): Promise<Metadata> {
    const profile = await prisma.user.findUnique({
        where: {
            id: Number(profileId),
        },
    });

    if (!profile) {
        return {
            title: "rePlate - Profil von user",
        };
    }

    return {
        title: `rePlate - ${profile.username}`,
    };
}
