export type Banner = { img: string; caption: string };
export type Testimonial = { name: string; role: string; text: string; rating: number; img: string };
export type PackageType = { title: string; price: string; tag?: string; img: string };
export type Client = { name: string; img: string };

export type RangeKey = "any" | "0-10" | "10-50" | "50-100" | "100+";

export type InfluencersMetaResp =
| { data: unknown[]; meta: { total: number } }

export type InfluencerType = {
    id: string;
    name: string;
    username?: string | null;
    followers?: number | null;
    img?: string | null;
    created_at?: string | null;
  };
  