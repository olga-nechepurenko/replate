import Image from "next/image";
import meal from "@/images/pexels-photo-4871119.webp";
import Link from "next/link";
import { auth } from "@/auth";
import SearchComponent from "@/components/SearchComponent";
import prisma from "@/prisma/db";
import type { Location, User } from "@prisma/client";

export type UserWithLocation = User & { Location: Location | null };
export default async function Home() {
    const session = await auth();
    let profile: unknown;
    if (session) {
        profile = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                Location: true,
            },
        });
    }

    return (
        <>
            {!session && (
                <div className="grid-container">
                    <div className="grid-item">
                        <Image
                            alt="meal"
                            className="full-width-image"
                            src={meal}
                            sizes="(max-width: 56rem) 90vw,  54rem"
                            placeholder="blur"
                        />
                    </div>
                    <div className="button-navigation-list">
                        <h2>WILLKOMMEN zu rePLATE</h2>
                        <ul>
                            <li>
                                <Link href="/register">Start sharing</Link>
                            </li>
                            <li>
                                <Link href="/explore">Explore food</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {session && (
                <>
                    <p className="welcome-message">
                        SERVUS {session.user.name}!
                    </p>
                    <p className="welcome-message">
                        SCHAU DIR AN, WAS IN DEINER NÄHE GIBT -{" "}
                        <Link href="/explore">EXPLORE FOOD</Link>
                    </p>
                    <SearchComponent
                        userProfile={profile as UserWithLocation}
                    />
                </>
            )}
        </>
    );
}
