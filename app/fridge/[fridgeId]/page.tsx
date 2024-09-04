//import ProductTeaser from '@/components/ProductTeaser';
//import type { Product } from '@/types/shop-types';
import type { Metadata } from "next";
import { capitalize } from "es-toolkit";
import { notFound } from "next/navigation";
import prisma from "@/prisma/db";

type Props = {
    params: {
        fridgeId: string;
    };
};
export default async function SingleFridgePage({
    params: { fridgeId },
}: Props) {
    const fridge = await prisma.fridge.findUnique({
        where: {
            id: Number(fridgeId),
        },
    });

    if (!fridge) {
        notFound();
    }

    return (
        <div>
            <h1 className="capitalize">{fridge.fridgeTitle}</h1>
            {/* <div className="product-teasers grid">
                {fridges.map((fridge) => (
                    <p key={fridge.id}>{fridge.fridgeTitle}</p>
                    // <FridgeTeaser key={fridge.id} {...fridge} />
                ))}
            </div> */}
        </div>
    );
}
