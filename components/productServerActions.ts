"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
import { z } from "zod";
import type { title } from "process";

export async function addProduct(prevState: unknown, formData: FormData) {
    const schema = zfd.formData({
        name: zfd.text(z.string().max(100)),
        fridgeId: zfd.text(z.coerce.number().positive()),
        description: zfd.text(z.string().max(500).optional()),
        quantity: zfd.text(z.coerce.number().positive()),
        expired: zfd.text(z.coerce.date()),
    });

    const { success, data, error } = schema.safeParse(formData);

    if (!success) {
        console.log(error);
        return {
            message: "Bitte überprüfen Sie Ihre Eingabe!",
            status: "data-error",
        };
    }

    const fridgeExist = await prisma.fridge.findUnique({
        where: {
            id: data.fridgeId,
        },
    });

    const successMessage = {
        message: "Produkt wurde angelegt",
        status: "success",
    };

    if (!fridgeExist) {
        return {
            message: "Ein Fehler ist aufgetretten",
            status: "data-error",
        };
    }

    //create foodItem in db
    await prisma.foodItem.create({
        data: {
            fridgeId: data.fridgeId,
            title: data.name,
            description: data.description ?? "",
            quantity: data.quantity,
            expirationDate: data.expired,
            Location: {
                connect: {
                    id: fridgeExist.locationId!,
                },
            },
        },
    });

    revalidatePath(`/fridge/${fridgeExist.id}`);

    return successMessage;
}

export async function deleteProduct(id: number, fridgeId: number | null) {
    await prisma.foodItem
        .delete({
            where: {
                id,
            },
        })
        .catch((err) => {
            console.log(err);
            return {
                message: "Ein Fehler ist aufgetreten!",
                status: "data-error",
            };
        });

    const successMessage = {
        message: "das Product wurde erfolgreich gelöscht",
        status: "success",
    };
    if (fridgeId) {
        revalidatePath(`/fridge/${fridgeId}`);
    }

    return successMessage;
}
export async function addFridge(prevState: unknown, formData: FormData) {
    console.log(formData.get("lat"));
    const schema = zfd.formData({
        name: zfd.text(z.string().max(100)),
        lat: zfd.text(z.coerce.number().positive()),
        lng: zfd.text(z.coerce.number().positive()),
        location: zfd.text(z.string().max(100)),
        profileId: zfd.text(z.coerce.number().positive()),
    });

    const { success, data, error } = schema.safeParse(formData);

    if (!success) {
        console.log(error);
        return {
            message: "Bitte überprüfen Sie Ihre Eingabe!",
            status: "data-error",
        };
    }

    const userProfileExist = await prisma.user.findUnique({
        where: {
            id: data.profileId,
        },
    });

    const successMessage = {
        message: "Kühlschrank wurde erfolgreich angelegt",
        status: "success",
    };

    if (!userProfileExist) {
        return {
            message: "Ein Fehler ist aufgetretten",
            status: "data-error",
        };
    }

    //find location with 2 parameter in db
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

    if (locationExists && locationExists !== null) {
        //create fridge in db
        await prisma.fridge.create({
            data: {
                userId: userProfileExist.id,
                defaultLocation: data.location,
                locationId: locationExists.id,
                fridgeTitle: data.name,
            },
        });
    } else {
        //create fridge and location in db
        const newFridge = await prisma.fridge.create({
            data: {
                User: {
                    connect: {
                        id: userProfileExist.id,
                    },
                },
                defaultLocation: data.location,
                fridgeTitle: data.name,
                Location: {
                    create: {
                        lat: Number(data.lat),
                        lng: Number(data.lng),
                    },
                },
            },
        });
    }

    revalidatePath(`/fridges/${userProfileExist.id}`);

    return successMessage;
}
