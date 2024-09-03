import Image from "next/image";
import meal from "@/images/pexels-photo-4871119.webp";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
    const session = await auth();
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
                        <h2>Willkommen zu rePlate</h2>
                        <ul>
                            <li>
                                <Link href="/register">Start sharing</Link>
                            </li>
                            <li>
                                <Link href="/">Explore food</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {session && (
                <p className="welcome-message">
                    Willkommen {session.user.name} !
                </p>
            )}
        </>
    );
}
