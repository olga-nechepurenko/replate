import Image from "next/image";
import meal from "@/images/pexels-photo-4871119.webp";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/prisma/db";
import FoodItemTeaser from "@/components/FoodItemTeaser";
import type { FoodItem, Fridge } from "@prisma/client";
import { userInDb } from "@/components/transactionServerActions";

export const metadata = {
    title: "RePlate - Explore",
    description: "Find your next meal",
};

export default async function Home() {
    type FoodItemWithFridge = FoodItem & { Fridge: Fridge | null };
    let foodItems: FoodItemWithFridge[] = [];

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

    if (session) {
        //get userId from db
        const profile = await userInDb(session.user.email);

        if (profile !== null) {
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
            {/* <p>Suche</p> */}
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
        </>
    );
}
