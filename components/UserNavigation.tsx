"use client";
import type { GitHubUser } from "@/types/auth-types";
import Image from "next/image";

import { useToggle } from "@/lib/hooks/useToggle";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { CgCloseO, CgMenuRound } from "react-icons/cg";
import { SignOut } from "./Auth/SignOut";

type LinkTarget = {
    text: string;
    url: string;
};

const linkTargets = [
    {
        text: "Kühlschranken",
        url: "/fridges",
    },
    {
        text: "Transactions",
        url: "/transactions",
    },
    {
        text: "Profil",
        url: "/profile",
    },
] satisfies LinkTarget[];

type Props = GitHubUser & { slot?: ReactNode };
export default function UserNavigation({ name, image, slot }: Props) {
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
                {/* {isOpen ? <CgCloseO /> : <CgMenuRound />} */}
            </button>
            {isOpen && (
                <>
                    <ul className="main-navigation__list">
                        {slot}
                        {getMenuItems(linkTargets, pathname)}
                    </ul>
                </>
            )}
        </nav>
    );
}

function getMenuItems(linkTargets: LinkTarget[], pathname: string) {
    /* Alle Link-Elemente sollen die CSS-Klasse main-navigation__link
    erhalten, zusätzlich soll das Link-Element, das der aktuell angezeigten
    Seite entspricht, die Klasse main-navigation__link--current erhalten */

    return linkTargets.map(({ text, url }) => {
        const isCurrentPage = url === pathname;

        // const cssClasses = `main-navigation__link ${
        //     isCurrentPage ? "main-navigation__link--current" : ""
        // }`;

        /* Etwas komplizierter Ansatz, um ein Attribut gar nicht oder mit
		einem bestimmten Wert in ein Element zu geben, ohne TS-Fehler oder
		ungültiges HTML zu erzeugen. (Bei vielen Attributen kann man false als
		Wert setzen, React lässt das Attribut dann weg, aber bei aria-current
		ist false ein gültiger Wert.)
		https://tink.uk/using-the-aria-current-attribute/  */
        const attributes = isCurrentPage
            ? ({ "aria-current": "page" } as const)
            : {};

        return (
            <li key={url}>
                <Link
                    //className={cssClasses}
                    href={url}
                    {...attributes}
                >
                    {text}
                </Link>
            </li>
        );
    });
}
