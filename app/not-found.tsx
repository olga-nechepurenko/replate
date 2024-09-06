import type { Metadata } from "next";
import Link from "next/link";
import meal from "@/images/pexels-photo-4871119.webp";
import Image from "next/image";

// https://nextjs.org/docs/app/api-reference/file-conventions/not-found

export const metadata: Metadata = {
    title: "404 - Nicht gefunden 🤷",
};

export default function NotFound() {
    return (
        <main className="default-layout">
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
                    <h4>Zu dieser URL wurde leider nichts gefunden 🤷</h4>
                    <ul>
                        <li>
                            <Link href="/">STARTSEITE</Link>
                        </li>
                        <li>
                            <Link href="/explore">EXPLORE PRODUCTS</Link>
                        </li>
                        <li>
                            <Link href="/register">REGISTRIERUNG</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
