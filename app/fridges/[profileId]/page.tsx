//import ProductTeaser from '@/components/ProductTeaser';
//import type { Product } from '@/types/shop-types';
import type { Metadata } from "next";
import { capitalize } from "es-toolkit";
import { notFound } from "next/navigation";
import prisma from "@/prisma/db";

type Props = {
    params: {
        profileId: string;
    };
};
export default async function FridgesPage({ params: { profileId } }: Props) {
    const fridges = await prisma.fridge.findMany({
        where: {
            userId: Number(profileId),
        },
    });

    if (!fridges.length) {
        notFound();
    }

    return (
        <div>
            <h1 className="capitalize">Meine Kühlschranken</h1>
            <div className="product-teasers grid">
                {fridges.map((fridge) => (
                    <p key={fridge.id}>{fridge.fridgeTitle}</p>
                    // <FridgeTeaser key={fridge.id} {...fridge} />
                ))}
            </div>
        </div>
    );
}
