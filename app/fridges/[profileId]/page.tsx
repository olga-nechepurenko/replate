//import ProductTeaser from '@/components/ProductTeaser';
//import type { Product } from '@/types/shop-types';
import type { Metadata } from "next";
import { capitalize } from "es-toolkit";
import { notFound, redirect } from "next/navigation";
import prisma from "@/prisma/db";
import FridgeTeaser from "@/components/FridgeTeaser";
import AddFridge from "@/components/AddFridge";
import { auth } from "@/auth";

type Props = {
    params: {
        profileId: string;
    };
};
export default async function FridgesPage({ params: { profileId } }: Props) {
    const session = await auth();
    if (!session) {
        redirect("/");
    }
    const fridges = await prisma.fridge.findMany({
        where: {
            userId: Number(profileId),
        },
        include: {
            Location: true,
            foodItems: true,
        },
    });

    if (!fridges.length) {
        notFound();
    }

    return (
        <div>
            <h1 className="capitalize">Meine Kühlschränken</h1>
            <div className="product-teasers grid">
                {fridges.map((fridge) => (
                    <FridgeTeaser key={fridge.id} {...fridge} />
                ))}
                <AddFridge profileId={Number(profileId)} />
            </div>
        </div>
    );
}
