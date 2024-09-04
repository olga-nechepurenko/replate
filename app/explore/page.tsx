import Image from "next/image";
import meal from "@/images/pexels-photo-4871119.webp";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/prisma/db";
import FoodItemTeaser from "@/components/FoodItemTeaser";

export const metadata = {
    title: "RePlate - Explore",
    description: "Find your next meal",
};

export default async function Home() {
    const session = await auth();
    //find foodItems with no expired date
    const foodItems = await prisma.foodItem.findMany({
        take: 20,
        where: {
            expirationDate: {
                gte: new Date(),
            },
        },
        include: {
            Fridge: true,
            Location: true,
        },
    });

    return (
        <>
            <p>Suche</p>
            <h2>Ich bin noch gut!</h2>
            <div className="product-teasers grid">
                {foodItems.map((foodItem) => (
                    <FoodItemTeaser
                        key={foodItem.id}
                        {...foodItem}
                        active={!!session}
                    />
                ))}
            </div>

            {/* {!session && ( */}
            {/* <div className="grid-container">
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
                            <Link href="/explore">Explore food</Link>
                        </li>
                    </ul>
                </div>
            </div> */}
            {/* )} */}

            {/* {session && (
                <p className="welcome-message">
                    Willkommen {session.user.name} !
                </p>
            )} */}
        </>
    );
}
