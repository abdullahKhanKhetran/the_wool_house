import bouquetMixedRoses from "./assets/bouquet-mixed-roses.jpg";
import bouquetBurgundyPeonies from "./assets/bouquet-burgundy-peonies.jpg";
import bouquetSingleRose from "./assets/bouquet-single-rose.jpg";
import bouquetPastelTulips from "./assets/bouquet-pastel-tulips.jpg";
import bouquetRedTulips from "./assets/bouquet-red-tulips.jpg";
import bouquetTulipsLily from "./assets/bouquet-tulips-lily.jpg";
import flowerRosePearls from "./assets/flower-rose-pearls.jpg";
import flowerSunflowerVase from "./assets/flower-sunflower-vase.jpg";
import flowerRosesCozy from "./assets/flower-roses-cozy.jpg";
import scrunchieWhiteFloral from "./assets/scrunchie-white-floral.jpg";
import scrunchieColorRoses from "./assets/scrunchie-color-roses.jpg";
import scrunchieBurgundyStrawberry from "./assets/scrunchie-burgundy-strawberry.jpg";
import dishHearts from "./assets/dish-hearts.jpg";
import reviewWorn from "./assets/review-scrunchies-worn.jpg";
import reviewPackaged from "./assets/review-scrunchies-packaged.jpg";

export const images = {
  bouquetMixedRoses,
  bouquetBurgundyPeonies,
  bouquetSingleRose,
  bouquetPastelTulips,
  bouquetRedTulips,
  bouquetTulipsLily,
  flowerRosePearls,
  flowerSunflowerVase,
  flowerRosesCozy,
  scrunchieWhiteFloral,
  scrunchieColorRoses,
  scrunchieBurgundyStrawberry,
  dishHearts,
  reviewWorn,
  reviewPackaged,
};

// `priceValue` is a Number (in INR); `price` is the display string.
// `inStock=false` items render but can't be added to cart.
export const collections = [
  {
    number: "Chapter 01",
    title: "Eternal\nBouquets",
    image: bouquetBurgundyPeonies,
    blurb:
      "Bouquets that never wilt — each bloom shaped petal by petal in soft cotton yarn. Made for weddings, anniversaries, or quiet rooms that deserve a little ceremony.",
    items: [
      { id: "b-peonies", name: "Burgundy peony bunch", desc: "stem of seven", priceValue: 2400, price: "Rs 2,400", image: bouquetBurgundyPeonies },
      { id: "b-single",  name: "Single rose, wrapped", desc: "matte black & silver", priceValue: 950, price: "Rs 950", image: bouquetSingleRose },
      { id: "b-mixed",   name: "Mixed cream & wine roses", desc: "twelve stems", priceValue: 3600, price: "Rs 3,600", image: bouquetMixedRoses },
      { id: "b-red-tulips", name: "Red tulips", desc: "bundle of nine", priceValue: 2100, price: "Rs 2,100", image: bouquetRedTulips },
      { id: "b-pastel",  name: "Pastel tulip posy", desc: "pink or blue, satin tie", priceValue: 1800, price: "Rs 1,800", image: bouquetPastelTulips },
      { id: "b-custom",  name: "Custom florals", desc: "shape, palette, scale", priceValue: 0, price: "On request", image: bouquetTulipsLily, inStock: false },
    ],
  },
  {
    number: "Chapter 02",
    title: "Popcorn\nAdornments",
    image: scrunchieWhiteFloral,
    blurb:
      "Popcorn-stitch scrunchies finished with hand-tied charms — tiny roses, strawberries, stars. Soft enough to sleep in, sweet enough to wear out.",
    items: [
      { id: "s-ivory",  name: "Popcorn scrunchie · ivory", desc: "with floral dangles", priceValue: 450, price: "Rs 450", image: scrunchieWhiteFloral },
      { id: "s-wine",   name: "Popcorn scrunchie · wine", desc: "with strawberry charms", priceValue: 500, price: "Rs 500", image: scrunchieBurgundyStrawberry },
      { id: "s-rosebud",name: "Rosebud scrunchie set", desc: "pair, mixed colours", priceValue: 850, price: "Rs 850", image: scrunchieColorRoses },
      { id: "s-charm",  name: "Charm-only refresh", desc: "add charms to your scrunchie", priceValue: 150, price: "Rs 150", image: scrunchieColorRoses },
    ],
  },
  {
    number: "Chapter 03",
    title: "Small\nComforts",
    image: dishHearts,
    blurb:
      "Little objects for the desk and bedside — heart-shaped trinket dishes for rings, balm and other small daily things. Made in batches of soft pastels.",
    items: [
      { id: "d-blush", name: "Heart trinket dish · blush", desc: "approx. 10cm", priceValue: 600, price: "Rs 600", image: dishHearts },
      { id: "d-ivory", name: "Heart trinket dish · ivory", desc: "approx. 10cm", priceValue: 600, price: "Rs 600", image: dishHearts },
      { id: "d-wine",  name: "Heart trinket dish · wine",  desc: "approx. 10cm", priceValue: 650, price: "Rs 650", image: dishHearts },
      { id: "d-set3",  name: "Set of three", desc: "your choice of colours", priceValue: 1650, price: "Rs 1,650", image: dishHearts },
    ],
  },
];

export const galleryTiles = [
  { src: bouquetMixedRoses, cap: "Cream & Wine · No. 04", c: "t1" },
  { src: flowerSunflowerVase, cap: "Red Sunflower · No. 09", c: "t2" },
  { src: scrunchieColorRoses, cap: "Rosebud Scrunchies", c: "t3" },
  { src: flowerRosePearls, cap: "Pearls & Petals", c: "t4" },
  { src: bouquetPastelTulips, cap: "Pastel Tulip Twins", c: "t5" },
  { src: bouquetRedTulips, cap: "Flowers Crew · Reds", c: "t6" },
  { src: bouquetTulipsLily, cap: "Tulips & Lily", c: "t7" },
  { src: flowerRosesCozy, cap: "Studio nights", c: "t8" },
];

export const reviews = [
  {
    image: reviewWorn,
    stars: 5,
    quote:
      "I wore the matching scrunchies to my sister's mehndi and three people asked where they were from. The popcorn stitch is so plush — they feel like little clouds on the wrist.",
    name: "Ayesha R.",
    location: "Lahore",
    item: "Rosebud scrunchie set",
  },
  {
    image: reviewPackaged,
    stars: 5,
    quote:
      "Beautifully packaged, exactly as pictured, and arrived faster than promised. The roses are dense and stand up on their own. Already planning to order a bouquet next.",
    name: "Hira K.",
    location: "Karachi",
    item: "Popcorn scrunchie · ivory",
  },
];
