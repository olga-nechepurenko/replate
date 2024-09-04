"use client";
import type { GitHubUser } from "@/types/auth-types";
import Image from "next/image";
import { useToggle } from "@/lib/hooks/useToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type Props = GitHubUser & { slot?: ReactNode } & { profileId?: number | null };
export default function UserNavigation({
    name,
    email,
    image,
    slot,
    profileId,
}: Props) {
    const [isOpen, toogleMenu, , , closeMenu] = useToggle(false);

    const pathname = usePathname();
    /* Wenn pathname sich ändert, soll das Menü geschlossen werden. */

    useEffect(closeMenu, [pathname]);
    return (
        <nav className="main-navigation">
            <button
                onClick={toogleMenu}
                className="main-navigation__button"
                aria-expanded={isOpen}
                aria-label="Hauptmenü"
            >
                <div className="user">
                    {name}
                    {image && (
                        <Image
                            src={image}
                            alt={`GitHub-Avatar von ${name}`}
                            width={64}
                            height={64}
                        />
                    )}
                </div>
            </button>
            {isOpen && (
                <>
                    <ul className="main-navigation__list">
                        {slot}
                        {profileId ? (
                            <>
                                <Link href={`/fridges/${profileId}`}>
                                    Kühlschränken
                                </Link>
                                <Link href={`/transactions/${profileId}`}>
                                    Transactions
                                </Link>
                                <Link href={`/profile/${profileId}`}>
                                    Profil
                                </Link>
                            </>
                        ) : (
                            <Link href={`/profile/new`}>Profil erstellen</Link>
                        )}
                    </ul>
                </>
            )}
        </nav>
    );
}
