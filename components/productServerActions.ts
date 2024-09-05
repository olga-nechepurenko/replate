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
            locationId: fridgeExist.locationId,
            category: "",
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

export async function searchProducts(
    productName: string,
    userLat: number,
    userLng: number,
    radius: number
) {
    if (!productName || !userLat || !userLng) {
        return [];
    }

    // Step 1: Search foodItems by name
    const foodItems = await prisma.foodItem
        .findMany({
            where: {
                title: {
                    contains: String(productName), // Find food Item names that contain the search term
                    mode: "insensitive", // Case-insensitive search
                },
            },
            include: {
                Location: true,
                Fridge: true,
            },
        })
        .catch((err) => {
            console.log(err);
            return [];
        });

    // Step 2: Filter foodItems by distance
    const filteredFoodItems = foodItems.filter((foodItem) => {
        const foodItemLat = foodItem.Location!.lat;
        const foodItemLng = foodItem.Location!.lng;
        const distance = getDistanceFromLatLonInKm(
            userLat,
            userLng,
            foodItemLat,
            foodItemLng
        );
        return distance <= radius;
    });

    return filteredFoodItems;
}

// Helper function to calculate distance between two coordinates (Haversine formula)
function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}
function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}
