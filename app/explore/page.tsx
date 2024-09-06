import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/prisma/db";
import FoodItemTeaser from "@/components/FoodItemTeaser";
import type { FoodItem, Fridge } from "@prisma/client";
import SearchComponent from "@/components/SearchComponent";
import type { UserWithLocation } from "../page";

export const metadata = {
    title: "RePlate - Explore",
    description: "Find your next meal",
};

export default async function Home() {
    type FoodItemWithFridge = FoodItem & { Fridge: Fridge | null };
    let foodItems: FoodItemWithFridge[] = [];
    let username: unknown = null;
    let userid: unknown = null;
    let active: boolean = false;
    const session = await auth();
    if (!session) {
        //find 20 foodItems with no expired date to display examples
        foodItems = await prisma.foodItem.findMany({
            take: 20,
            where: {
                expirationDate: {
                    gte: new Date(),
                },
            },
            include: {
                Fridge: true,
            },
        });
    }

    let profile = null;
    if (session) {
        //get userId from db
        profile = (await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                Location: true,
            },
        })) as UserWithLocation | null;

        if (profile && profile !== null) {
            active = true;
            username = profile.username;
            userid = profile.id;
            //find 20 foodItems with no expired date and not from user to display
            foodItems = await prisma.foodItem.findMany({
                take: 20,
                where: {
                    AND: [
                        {
                            Fridge: {
                                isNot: {
                                    userId: profile.id,
                                },
                            },
                        },
                        {
                            expirationDate: {
                                gte: new Date(),
                            },
                        },
                    ],
                },
                include: {
                    Fridge: true,
                },
            });
        }
    }

    return (
        <>
            {session !== null ? (
                <SearchComponent userProfile={profile as UserWithLocation} />
            ) : (
                <SearchComponent userProfile={null} />
            )}
            <h2>Ich bin noch gut!</h2>
            {!session && (
                <p>
                    um loszulegen, <Link href="/register">MELDE DICH AN</Link>
                </p>
            )}
            <div className="product-teasers grid">
                {foodItems.map((foodItem) => (
                    <FoodItemTeaser
                        key={foodItem.id! as number}
                        title={foodItem.title}
                        quantity={foodItem.quantity}
                        expirationDate={foodItem.expirationDate}
                        description={foodItem.description}
                        id={foodItem.id}
                        locationId={foodItem.locationId}
                        Fridge={foodItem.Fridge}
                        active={active}
                        category={foodItem.category}
                        photo={foodItem.photo}
                        createdAt={foodItem.createdAt}
                        updatedAt={foodItem.updatedAt}
                        username={username as string | null}
                        userid={userid as number | null}
                    />
                ))}
            </div>
        </>
    );
}
