import type { FoodItem, Transaction, User } from "@prisma/client";
import { DeleteTransaction } from "./DeleteTransaction";
import { PickedUpButton } from "./PickedUpButton";

type Props = Transaction & { foodItem: FoodItem } & {
    receiver?: User;
} & {
    giver?: User;
} & {
    take?: boolean;
    give?: boolean;
};

export default async function TransactionInList({
    id,
    status,
    transactionDate,
    foodItem,
    giver,
    receiver,
    take,
    give,
}: Props) {
    const expired = foodItem.expirationDate < new Date();
    return (
        <>
            <article className="product-in-fridge">
                <h4>{foodItem.title}</h4>
                <strong>Mänge: {foodItem.quantity}</strong>
                {take && (
                    <div>
                        <time
                            dateTime={transactionDate
                                .toDateString()
                                .substring(0, 10)}
                        >
                            {transactionDate.toLocaleDateString("de")}
                        </time>
                        <p>von: {giver?.username}</p>
                    </div>
                )}
                {give && (
                    <div>
                        <time
                            dateTime={transactionDate
                                .toDateString()
                                .substring(0, 10)}
                        >
                            {transactionDate.toLocaleDateString("de")}
                        </time>
                        <p>für: {receiver?.username}</p>
                    </div>
                )}

                {expired ? (
                    <strong>Abgelaufen</strong>
                ) : (
                    <p>
                        Noch gut bis:
                        <time
                            dateTime={foodItem.expirationDate
                                .toDateString()
                                .substring(0, 10)}
                        >
                            {foodItem.expirationDate.toLocaleDateString("de")}
                        </time>
                    </p>
                )}
                <div>
                    <DeleteTransaction
                        id={id}
                        receiverId={receiver?.id ?? null}
                        giverId={giver?.id ?? null}
                    />
                    {give && (
                        <PickedUpButton
                            id={id}
                            receiverId={receiver?.id ?? null}
                            giverId={giver?.id ?? null}
                            foodItemId={foodItem.id}
                        />
                    )}
                </div>
            </article>
        </>
    );
}
