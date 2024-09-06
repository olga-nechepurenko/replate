import { DeleteProduct } from "./DeleteProduct";

type Props = {
    id: number;
    title: string;
    description: string;
    category: string;
    quantity: number;
    expirationDate: Date;
    photo: string | null;
    createdAt: Date;
    updatedAt: Date;
    fridgeId: number | null;
};
export default async function ProductInFridge({
    id,
    title,
    quantity,
    category,
    description,
    expirationDate,
    fridgeId,
}: Props) {
    const expired = expirationDate < new Date();
    return (
        <>
            <article className="product-in-fridge">
                <h4>{title}</h4>
                <p>{description}</p>
                {category && <p>Kategorie: {category}</p>}
                <strong>Mänge: {quantity}</strong>
                {expired ? (
                    <strong>Abgelaufen</strong>
                ) : (
                    <p>
                        Noch gut bis:{" "}
                        <time
                            dateTime={expirationDate
                                .toDateString()
                                .substring(0, 10)}
                        >
                            {expirationDate.toLocaleDateString("de")}
                        </time>
                    </p>
                )}

                <DeleteProduct id={id} fridgeId={fridgeId} />
            </article>
        </>
    );
}
