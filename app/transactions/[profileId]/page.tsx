import type { Metadata } from "next";
import prisma from "@/prisma/db";
import TransactionInList from "@/components/TransactionInList";

export const revalidate = 3600;

export async function generateMetadata({
    params: { profileId },
}: Props): Promise<Metadata> {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(profileId),
        },
    });
    if (!user) {
        return {
            title: "rePlate - Transactions von User",
        };
    }
    return {
        title: `rePlate - Transactions: ${user.username} `,
    };
}
type Props = {
    params: {
        profileId: string;
    };
};
export default async function UserTransactionsPage({
    params: { profileId },
}: Props) {
    const giveTransactions = await prisma.transaction
        .findMany({
            where: {
                giverId: Number(profileId),
                status: "PENDING",
            },
            include: {
                foodItem: true,
                receiver: true,
                giver: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        .catch((error) => {
            console.error(error);
        });
    const takeTransactions = await prisma.transaction
        .findMany({
            where: {
                receiverId: Number(profileId),
                status: "PENDING",
            },
            include: {
                foodItem: true,
                giver: true,
                receiver: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        .catch((error) => {
            console.error(error);
        });

    return (
        <div className="content-padding">
            <h2>Meine Transactions</h2>
            {!giveTransactions?.length ||
            giveTransactions?.length === 0 ||
            !takeTransactions?.length ||
            takeTransactions?.length === 0 ? (
                <p>(keine Transactions vorhanden)</p>
            ) : (
                <></>
            )}

            <div>
                {giveTransactions?.length && giveTransactions?.length > 0 && (
                    <>
                        <dt>
                            <h4>Verschenken:</h4>
                        </dt>

                        <dd>
                            {giveTransactions.map((transaction) => (
                                <TransactionInList
                                    key={transaction.id}
                                    give={true}
                                    {...transaction}
                                />
                            ))}
                        </dd>
                    </>
                )}
            </div>

            <div>
                {takeTransactions?.length && takeTransactions?.length > 0 && (
                    <>
                        <dt>
                            <h4>Retten:</h4>
                        </dt>
                        <dd>
                            {takeTransactions.map((transaction) => (
                                <TransactionInList
                                    key={transaction.id}
                                    take={true}
                                    {...transaction}
                                />
                            ))}
                        </dd>
                    </>
                )}

                <h4>TODO: Archive component</h4>
            </div>
        </div>
    );
}
