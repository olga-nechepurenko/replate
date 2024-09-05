//import ProductTeaser from '@/components/ProductTeaser';
//import type { Product } from '@/types/shop-types';
import type { Metadata } from "next";
import { capitalize } from "es-toolkit";
import { notFound } from "next/navigation";
import prisma from "@/prisma/db";

import { IoAddCircleOutline } from "react-icons/io5";
import AddProduct from "@/components/AddProduct";
import ProductInFridge from "@/components/ProductInFridge";

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
            foodItems: {
                orderBy: {
                    expirationDate: "desc",
                },
            },
        },
    });

    if (!fridge) {
        notFound();
    }

    return (
        <div>
            <h3 className="capitalize">{fridge.fridgeTitle}</h3>
            {fridge.defaultLocation && (
                <>
                    <strong>Ort: {fridge.defaultLocation}</strong>
                </>
            )}

            <dt>
                <h4>Produkte:</h4>
            </dt>
            <dd>
                {/* add products */}
                <AddProduct fridgeId={Number(fridge.id)} />
            </dd>
            {fridge?.foodItems?.length > 0 ? (
                <>
                    <dd>
                        {fridge.foodItems.map((foodItem) => (
                            <ProductInFridge key={foodItem.id} {...foodItem} />
                        ))}
                    </dd>
                </>
            ) : (
                <p>(keine Produkte vorhanden)</p>
            )}
        </div>
    );
}
