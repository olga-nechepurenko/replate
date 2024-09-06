"use client";

import type { UserWithLocation } from "@/app/page";
import { useState } from "react";
import { searchProducts } from "./productServerActions";
import type { FoodItem, Fridge } from "@prisma/client";
import FoodItemTeaser from "./FoodItemTeaser";

type Props = {
    userProfile: UserWithLocation;
};
export type FoodItemWithFridge = { Fridge: Fridge | null } & FoodItem;

export default function SearhComponent({ userProfile }: Props) {
    const defaultRadius = 10;
    const userLat = userProfile?.Location?.lat;
    const userLng = userProfile?.Location?.lng;

    const [radius, setRadius] = useState(defaultRadius);
    const [productName, setProductName] = useState("");
    const [foodItems, setFoodItems] = useState([] as FoodItemWithFridge[]);

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!userLat || !userLng) {
            console.error("User location not available");
            return;
        }

        //search for foodItems in radius
        const foodItems = await searchProducts(
            productName,
            userLat,
            userLng,
            radius
        );
        setFoodItems(foodItems);
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

                <button type="submit">finde in meiner Nähe</button>
            </form>
            {foodItems.length > 0 ? (
                <>
                    <h4>
                        Ich bin noch gut: {productName} : {foodItems.length} in
                        der Nähe{" "}
                    </h4>
                    <div className="product-teasers grid">
                        {foodItems.map((foodItem) => (
                            <FoodItemTeaser
                                key={foodItem.id}
                                {...foodItem}
                                active={true}
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
