//import ProductTeaser from '@/components/ProductTeaser';
//import type { Product } from '@/types/shop-types';
import type { Metadata } from "next";
import { capitalize } from "es-toolkit";
import { notFound } from "next/navigation";
import prisma from "@/prisma/db";
import ProductInFridge from "@/components/ProductInFridge";
import { IoAddCircleOutline } from "react-icons/io5";

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
        include: {
            Location: true,
            foodItems: true,
        },
    });

    if (!fridge) {
        notFound();
    }

    return (
        <div>
            <h1 className="capitalize">{fridge.fridgeTitle}</h1>
            {fridge.defaultLocation && (
                <>
                    <strong>Ort: {fridge.defaultLocation}</strong>
                </>
            )}

            {fridge.foodItems.length > 0 && (
                <>
                    <dt>
                        <h4>Produkte: <IoAddCircleOutline /></h4>
                    </dt>
                    <dd>
                        {fridge.foodItems.map((foodItem) => (
                            <ProductInFridge key={foodItem.id} {...foodItem} />
                        ))}
                    </dd>
                </>
            )}
        </div>
    );
}
