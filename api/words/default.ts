import { DEFAULT_PREMIUM_WORDS } from "../_data";

export default function handler(_req: any, res: any) {
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  res.status(200).json(DEFAULT_PREMIUM_WORDS);
}
