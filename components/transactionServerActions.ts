"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { wait } from "@/lib/helpers";

export async function userInDb(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
}
export async function addUser(prevState: unknown, formData: FormData) {
    const schema = zfd.formData({
        name: zfd.text(z.string().max(100)),
        email: zfd.text(z.string().email()),
        lat: zfd.text(z.coerce.number().positive()),
        lng: zfd.text(z.coerce.number().positive()),
        bio: zfd.text(z.string().max(500).optional()),
        privacy: z.literal("accept"),
        location: zfd.text(z.string().max(100)),
    });

    const { success, data, error } = schema.safeParse(formData);

    if (!success) {
        console.log(error);
        return {
            message: "Bitte überprüfen Sie Ihre Eingabe!",
            status: "data-error",
        };
    }

    const emailExists = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    const successMessage = {
        message:
            "Vielen Dank. Bitte prüfen Sie ihre Mailbox und bestätigen Sie die Mailadresse",
        status: "success",
    };

    if (emailExists) {
        // Aus Datenschutzgründen nicht verraten, dass Mailadresse schon existiert
        return successMessage;
    }

    //find location with 2 parameter in db
    //check if location exists

    const locationExists = await prisma.location.findFirst({
        where: {
            AND: [
                {
                    lat: Number(data.lat),
                },
                {
                    lng: Number(data.lng),
                },
            ],
        },
    });

    if (locationExists) {
        //create user in db
        await prisma.user.create({
            data: {
                username: data.name,
                email: data.email,
                Location: {
                    connect: {
                        id: locationExists.id,
                    },
                },
                fridges: {
                    create: [
                        {
                            defaultLocation: data.location,
                            Location: {
                                connect: {
                                    id: locationExists.id,
                                },
                            },
                        },
                    ],
                },
                bio: data.bio,
                defaultLocation: data.location,
            },
        });
    } else {
        //create user and location in db
        const newUser = await prisma.user.create({
            data: {
                username: data.name,
                email: data.email,
                Location: {
                    create: {
                        lat: Number(data.lat),
                        lng: Number(data.lng),
                    },
                },
                bio: data.bio,
                defaultLocation: data.location,
            },
        });

        //create fridge in db
        await prisma.fridge.create({
            data: {
                userId: newUser.id,
                defaultLocation: data.location,
                locationId: newUser.locationId,
                fridgeTitle: "Home",
            },
        });
    }

    revalidatePath("/register");

    return successMessage;
}

export async function sendMessage(prevState: unknown, formData: FormData) {
    const schema = zfd.formData({
        senderId: zfd.text(z.coerce.number()),
        recieverId: zfd.text(z.coerce.number()),
        foodItemId: zfd.text(z.coerce.number()),
        content: zfd.text(z.string().max(500).optional()),
        messageId: zfd.text(z.coerce.number()),
    });

    const { success, data, error } = schema.safeParse(formData);

    if (!success || data.recieverId === data.senderId) {
        console.log(error);
        return {
            message: "Bitte überprüfen Sie Ihre Eingabe!",
            status: "data-error",
        };
    }

    const successMessage = {
        message: "Message erfolgreich gesendet.",
        status: "success",
    };

    //add message to db
    await prisma.message
        .create({
            data: {
                senderId: data.recieverId,
                receiverId: data.senderId,
                foodItemId: data.foodItemId,
                content: data.content ?? "",
                read: false,
            },
        })
        .catch((error) => {
            console.log(error);
            return {
                message: "ein Fehler aufgetretten",
                status: "data-error",
            };
        });

    //update old message as readed
    if (data.messageId) {
        //update message
        await prisma.message
            .update({
                where: {
                    id: data.messageId,
                },
                data: {
                    read: true,
                },
            })
            .catch((error) => {
                console.log(error);
                return {
                    message: "ein Fehler aufgetretten",
                    status: "data-error",
                };
            });
    }

    revalidatePath(`/messages/${data.senderId}`);
    revalidatePath(`/messages/${data.recieverId}`);

    return successMessage;
}
