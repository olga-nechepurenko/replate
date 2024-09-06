"use server";

import prisma from "@/prisma/db";
import type { User } from "@prisma/client";
import Link from "next/link";

type Props = {
    email: string | null;
};

export async function MessagesWidget({ email }: Props) {
    if (!email) {
        return <></>;
    }

    const profile = (await prisma.user
        .findUnique({
            where: {
                email,
            },
        })
        .catch((err) => {
            console.log(err);
            return <></>;
        })) as User;
    if (!profile) {
        return <></>;
    }

    const newMessages = await prisma.message
        .count({
            where: {
                receiverId: profile.id,
                read: false,
            },
        })
        .catch((err) => {
            console.log(err);
            return <></>;
        });

    if (!newMessages || newMessages === 0) {
        return <></>;
    }

    return (
        <Link href={`/messages/${profile.id}`} className="message-widget">
            <button className="message-widget-button">{newMessages}</button>
        </Link>
    );
}
