import { useEffect, useState } from "react";
import bg1 from "@/assets/images/backgrounds/happy-asian-family-dinner-table.jpg";
import bg2 from "@/assets/images/backgrounds/little-girl-doesn-t-want-eat-vegetables.jpg";
import bg3 from "@/assets/images/backgrounds/mother-holding-her-baby-boy-kitchen.jpg";
import bg4 from "@/assets/images/backgrounds/vitaly-gariev-6eDFSCSwkSo-unsplash.jpg";

const backgrounds = [bg1, bg2, bg3, bg4];
const INTERVAL_MS = 3000;

export const useRotatingBackground = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    backgrounds.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return backgrounds[index];
};
