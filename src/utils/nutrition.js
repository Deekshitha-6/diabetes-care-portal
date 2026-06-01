const foodDb = {
  pizza: {
    name: "Pizza",
    calories: 266,
    carbs: 33,
    sugar: 3.6,
    protein: 11,
    fat: 10,
    gi: { value: 80, rating: "high" },
    color: "red",
    rationale: "Highly processed, high carbohydrate load, rapid blood sugar spike, and loaded with saturated fats."
  },
  burger: {
    name: "Burger",
    calories: 295,
    carbs: 29,
    sugar: 5.1,
    protein: 13,
    fat: 14,
    gi: { value: 65, rating: "high" },
    color: "red",
    rationale: "Refined carbs in buns, high fat content, and high glycemic impact. Advised to avoid in diabetes."
  },
  pasta: {
    name: "Pasta (White)",
    calories: 157,
    carbs: 31,
    sugar: 1.5,
    protein: 5.8,
    fat: 0.9,
    gi: { value: 70, rating: "high" },
    color: "red",
    rationale: "Refined wheat pasta converts quickly into glucose, leading to high glycemic load."
  },
  dosa: {
    name: "Dosa (Rice)",
    calories: 168,
    carbs: 29,
    sugar: 0.5,
    protein: 3.9,
    fat: 3.7,
    gi: { value: 77, rating: "high" },
    color: "red",
    rationale: "Fermented white rice batter has a high glycemic index. Moderate portion size with lots of sambar/fiber is essential."
  },
  idli: {
    name: "Idli",
    calories: 58,
    carbs: 12,
    sugar: 0.2,
    protein: 1.6,
    fat: 0.1,
    gi: { value: 65, rating: "medium" },
    color: "yellow",
    rationale: "Fermented rice and lentil base. Lower calories, but carbohydrates are still relatively high. Portion control required."
  },
  rice: {
    name: "White Rice",
    calories: 130,
    carbs: 28,
    sugar: 0.1,
    protein: 2.7,
    fat: 0.3,
    gi: { value: 73, rating: "high" },
    color: "red",
    rationale: "Polished white rice contains little fiber, causing rapid elevation in post-prandial blood glucose."
  },
  apple: {
    name: "Apple",
    calories: 52,
    carbs: 14,
    sugar: 10,
    protein: 0.3,
    fat: 0.2,
    gi: { value: 39, rating: "low" },
    color: "green",
    rationale: "Rich in pectin fiber, low glycemic index, and packed with health-promoting antioxidants."
  },
  salad: {
    name: "Green Salad",
    calories: 15,
    carbs: 3.6,
    sugar: 1.5,
    protein: 1.2,
    fat: 0.2,
    gi: { value: 15, rating: "low" },
    color: "green",
    rationale: "Extremely fiber-rich, low calories and sugars, excellent for glycemic stability and weight control."
  },
  paneer: {
    name: "Paneer (Cottage Cheese)",
    calories: 265,
    carbs: 3.1,
    sugar: 2.8,
    protein: 18,
    fat: 20,
    gi: { value: 20, rating: "low" },
    color: "green",
    rationale: "High in quality proteins and healthy fats, with minimal glycemic impact. Supports muscle synthesis and satiety."
  },
  yogurt: {
    name: "Greek Yogurt (Plain)",
    calories: 59,
    carbs: 3.6,
    sugar: 3.2,
    protein: 10,
    fat: 0.4,
    gi: { value: 14, rating: "low" },
    color: "green",
    rationale: "Low carbohydrate density, excellent dairy protein load, and gut-healthy active cultures."
  },
  almonds: {
    name: "Almonds",
    calories: 579,
    carbs: 22,
    sugar: 4.4,
    protein: 21,
    fat: 49,
    gi: { value: 15, rating: "low" },
    color: "green",
    rationale: "Highly satisfying source of magnesium, vitamin E, proteins, and healthy monounsaturated fatty acids."
  },
  oats: {
    name: "Rolled Oats",
    calories: 389,
    carbs: 66,
    sugar: 0.1,
    protein: 16.9,
    fat: 6.9,
    gi: { value: 55, rating: "medium" },
    color: "yellow",
    rationale: "Loaded with beta-glucan soluble fiber which slows sugar absorption, but requires sensible portion sizes."
  },
  roti: {
    name: "Whole Wheat Roti",
    calories: 120,
    carbs: 22,
    sugar: 0.4,
    protein: 4,
    fat: 1.5,
    gi: { value: 62, rating: "medium" },
    color: "yellow",
    rationale: "Better fiber content than refined flour, but remains carb-dense. Limit quantity to manage glycemic load."
  }
};
function findFoodInDb(query) {
  const norm = query.toLowerCase().trim();
  if (foodDb[norm]) {
    return foodDb[norm];
  }
  for (const key of Object.keys(foodDb)) {
    if (norm.includes(key) || key.includes(norm)) {
      return foodDb[key];
    }
  }
  return {
    name: query.charAt(0).toUpperCase() + query.slice(1),
    calories: 180,
    carbs: 25,
    sugar: 8,
    protein: 4,
    fat: 6,
    gi: { value: 62, rating: "medium" },
    color: "yellow",
    rationale: "Dynamic nutrition estimation: monitor sugar density and maintain clean portion controls."
  };
}
function analyzeFoodQuantity(item, quantityInGrams, allergies = [], contradictions = []) {
  const factor = quantityInGrams / 100;
  const totalCalories = Math.round(item.calories * factor);
  const totalCarbLoad = Math.round(item.carbs * factor * 10) / 10;
  const totalSugar = Math.round(item.sugar * factor * 10) / 10;
  const totalFat = Math.round(item.fat * factor * 10) / 10;
  const totalProtein = Math.round(item.protein * factor * 10) / 10;
  let eatSafety = "safe";
  let glycemicImpact = "Low";
  let explanation = "";
  if (item.gi.value >= 70) {
    glycemicImpact = "High";
  } else if (item.gi.value >= 56) {
    glycemicImpact = "Moderate";
  } else {
    glycemicImpact = "Low";
  }
  const glyLoad = item.gi.value * totalCarbLoad / 100;
  if (item.color === "red" || glyLoad > 20 || totalCalories > 350 || totalSugar > 15) {
    eatSafety = "dangerous";
    explanation = `High risk! This portion creates a high Glycemic Load (${glyLoad.toFixed(1)}) and high caloric load (${totalCalories} kcal). This triggers insulin surges, fueling glucose storage as fat and promoting clinical insulin resistance. Avoiding this completely or substituting with healthier options is recommended.`;
  } else if (item.color === "yellow" || glyLoad > 10 && glyLoad <= 20 || totalCalories > 150 && totalCalories <= 350 || totalSugar > 5 && totalSugar <= 15) {
    eatSafety = "caution";
    explanation = `Moderate notice. The Glycemic Load is safe (${glyLoad.toFixed(1)}) but contains moderate carbs or calories (${totalCalories} kcal, ${totalFat}g fats). Portion controls are highly important here to keep you from exceeding daily bounds. Avoid eating this regularly.`;
  } else {
    eatSafety = "safe";
    explanation = `Perfect wellness companion! Excellent dietary balance. It has a low Glycemic Load (${glyLoad.toFixed(1)}) and low calorific content (${totalCalories} kcal). High protein (${totalProtein}g) and essential fiber promote stable glucose levels, prolong satiety, and support metabolic health.`;
  }
  const nameLower = item.name.toLowerCase();
  let matchedAllergen = "";
  for (const allergy of allergies) {
    if (allergy && nameLower.includes(allergy.toLowerCase().trim())) {
      matchedAllergen = allergy;
      break;
    }
  }
  let matchedContra = "";
  for (const contra of contradictions) {
    if (contra && nameLower.includes(contra.toLowerCase().trim())) {
      matchedContra = contra;
      break;
    }
  }
  if (matchedAllergen) {
    eatSafety = "dangerous";
    explanation = `\u26A0\uFE0F ALLERGEN WARNING: This scanned/entered food item matches your recorded allergy to "${matchedAllergen}". Please avoid consuming this item to safeguard your clinical health.`;
    glycemicImpact = "High";
  } else if (matchedContra) {
    eatSafety = "dangerous";
    explanation = `\u26A0\uFE0F CLINICAL CONTRADICTION WARNING: This scanned/entered food item matches a recorded health contraindication/symptom ("${matchedContra}"). Consult your physician or opt for safer diabetic choices.`;
    glycemicImpact = "High";
  } else if (quantityInGrams >= 250) {
    eatSafety = "caution";
    explanation = `\u26A0\uFE0F HIGH PORTION WARNING: Real-time analysis flags high quantity (${quantityInGrams}g). Consuming large amounts creates a high load of carbohydrates and insulin demand on your body. Consider decreasing portion size to 150g instead. ` + explanation;
  }
  return {
    totalCalories,
    totalCarbLoad,
    totalSugar,
    glycemicImpact,
    eatSafety,
    explanation
  };
}
export {
  analyzeFoodQuantity,
  findFoodInDb,
  foodDb
};
