import { Banner, Client, PackageType, Testimonial } from "../types/type";




export const BANNERS: Banner[] = [
  { img: "/banner/banner1.png", caption: "Boost Brand Awareness" },
  { img: "/banner/banner2.png", caption: "Scale with Micro-KOLs" },
  { img: "/banner/banner3.png", caption: "Launch. Iterate. Win." },
  { img: "/banner/banner4.png", caption: "Creator-Led Growth" },
  { img: "/banner/banner5.png", caption: "Measure What Matters" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Lucy Juliana Wagey",
    role: "Influencer",
    text: "Brief jelas, koordinasi rapi. Setelah join, endorse & paid promote naik signifikan.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Reza Pratama",
    role: "Brand Manager",
    text: "Satu dashboard untuk plan hingga reporting. Hemat waktu, hasil terukur.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60",
  },
];
export const BRAND = "#6f2dbd" as const;
export const INITIAL_BATCH = 12;
export const LOAD_MORE = 10;
export const BRAND_BORDER = "#e9d8ff";
export const BRAND_SOFT = "#f7f1ff";
export const PAGE_SIZE = 10;


export const PACKAGES: PackageType[] = [
  {
    title: "Paket Endorsement 10 Micro Influencer",
    price: "Rp2.500.000",
    tag: "Paling Laris",
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&auto=format&fit=crop&q=60",
  },
  {
    title: "Paket Paid Promote 10 Micro Influencer",
    price: "Rp1.500.000",
    tag: "Hemat",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=60",
  },
  {
    title: "Paket Produk Review 10 Micro Influencer",
    price: "Rp2.000.000",
    tag: "Value",
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&auto=format&fit=crop&q=60",
  },
];

export const CLIENTS: Client[] = [
  { name: "DANA", img: "/clients/dana.png" },
  { name: "Shopee", img: "/clients/shopee.png" },
  { name: "Gojek", img: "/clients/gojek.png" },
  { name: "MS Glow", img: "/clients/msglow.png" },
];
