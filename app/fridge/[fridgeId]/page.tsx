import { notFound, redirect } from "next/navigation";
import prisma from "@/prisma/db";

import AddProduct from "@/components/AddProduct";
import ProductInFridge from "@/components/ProductInFridge";
import { auth } from "@/auth";

type Props = {
    params: {
        fridgeId: string;
    };
};
export default async function SingleFridgePage({
    params: { fridgeId },
}: Props) {
    const session = await auth();
    if (!session) {
        redirect("/");
    }
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
