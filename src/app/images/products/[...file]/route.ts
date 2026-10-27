import { NextRequest, NextResponse } from "next/server";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";

const FILE_MAP: Record<string, string> = {
  "dragons-blood.jpg": CLOUDINARY_IMAGES.dragonsBlood,
  "dragons-blood": CLOUDINARY_IMAGES.dragonsBlood,
  "damask-rose.jpg": CLOUDINARY_IMAGES.damaskRose,
  "damask-rose": CLOUDINARY_IMAGES.damaskRose,
  "saffron-honey.jpg": CLOUDINARY_IMAGES.saffronHoney,
  "saffron-honey": CLOUDINARY_IMAGES.saffronHoney,
  "terracotta-orange.jpg": CLOUDINARY_IMAGES.terracottaOrange,
  "terracotta-orange": CLOUDINARY_IMAGES.terracottaOrange,
  "charcoal-clay.jpg": CLOUDINARY_IMAGES.charcoalClay,
  "charcoal-clay": CLOUDINARY_IMAGES.charcoalClay,
  "lavender-silk.jpg": CLOUDINARY_IMAGES.lavenderSilk,
  "lavender-silk": CLOUDINARY_IMAGES.lavenderSilk,
  "oud-sandalwood.jpg": CLOUDINARY_IMAGES.oudSandalwood,
  "oud-sandalwood": CLOUDINARY_IMAGES.oudSandalwood,
  "eucalyptus-mint.jpg": CLOUDINARY_IMAGES.eucalyptusMint,
  "eucalyptus-mint": CLOUDINARY_IMAGES.eucalyptusMint,
  "festive-box.jpg": CLOUDINARY_IMAGES.festiveBox,
  "festive-box": CLOUDINARY_IMAGES.festiveBox,
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> }
) {
  const { file } = await params;
  const fileName = (file && file.length > 0 ? file[file.length - 1] : "").toLowerCase();

  const targetUrl = FILE_MAP[fileName] || CLOUDINARY_IMAGES.defaultProduct;
  return NextResponse.redirect(targetUrl, 307);
}
