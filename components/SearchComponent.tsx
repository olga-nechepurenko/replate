"use client";

import type { UserWithLocation } from "@/app/page";
import { useState } from "react";
import {
    searchProducts,
    searchProductsWithoutRadius,
} from "./productServerActions";
import type { FoodItem, Fridge } from "@prisma/client";
import FoodItemTeaser from "./FoodItemTeaser";

type Props = {
    userProfile: UserWithLocation | null;
};
export type FoodItemWithFridge = { Fridge: Fridge | null } & FoodItem;

export default function SearhComponent({ userProfile }: Props) {
    let username: unknown = null;
    let userid: unknown = null;
    if (userProfile && userProfile !== null) {
        username = userProfile.username;
        userid = userProfile.id;
    }
    const defaultRadius = 10;
    const [radius, setRadius] = useState(defaultRadius);
    const [productName, setProductName] = useState("");
    const [foodItems, setFoodItems] = useState([] as FoodItemWithFridge[]);

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        let foodItems: FoodItemWithFridge[] = [];

        if (userProfile !== null) {
            console.log("start search userProfile", userProfile);
            const userLat = userProfile?.Location?.lat;
            const userLng = userProfile?.Location?.lng;
            if (!userLat || !userLng) {
                console.error("User location not available");
                return;
            }
            //search for foodItems in radius
            foodItems = await searchProducts(
                productName,
                userLat,
                userLng,
                radius
            );
            setFoodItems(foodItems);
        }
        if (userProfile === null) {
            //search for foodItems without radius
            foodItems = await searchProductsWithoutRadius(productName);
            setFoodItems(foodItems);
        }

        //setFoodItems(foodItems);
    };

    return (
        <>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="nach Lebensmittel suchen..."
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                {userProfile && userProfile !== null && (
                    <div className="slider-container">
                        <label htmlFor="radius-slider">
                            Search Radius: {radius} km
                        </label>
                        <input
                            id="radius-slider"
                            type="range"
                            min="1"
                            max="50"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                        />
                    </div>
                )}

                <button type="submit">
                    {!userProfile
                        ? "finde Lebensmittel"
                        : "finde in meiner Nähe"}
                </button>
            </form>
            {foodItems.length > 0 ? (
                <>
                    <h4>
                        Ich bin noch gut: {productName} : {foodItems.length}{" "}
                        {userProfile ? "in meiner Nähe gefunden" : "gefunden"}
                    </h4>
                    <div className="product-teasers grid">
                        {foodItems.map((foodItem) => (
                            <FoodItemTeaser
                                key={foodItem.id! as number}
                                title={foodItem.title}
                                quantity={foodItem.quantity}
                                expirationDate={foodItem.expirationDate}
                                description={foodItem.description}
                                id={foodItem.id}
                                locationId={foodItem.locationId}
                                Fridge={foodItem.Fridge}
                                active={true}
                                category={foodItem.category}
                                photo={foodItem.photo}
                                createdAt={foodItem.createdAt}
                                updatedAt={foodItem.updatedAt}
                                username={username as string | null}
                                userid={userid as number | null}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <h1>...</h1>
            )}
        </>
    );
}
