"use server";

import sharp from "sharp";
import { encode } from "blurhash";
import { supabase } from "@/lib/supabaseClient.ts";

export async function uploadImage(file: File | null) {
  if (!file) throw new Error("No file selected");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `menu-items/${fileName}`;

  // Convert File to Buffer (compatible with Node.js Server Actions)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload error:", error.message);
    throw new Error(error.message);
  }

  // Get public URL
  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error("Failed to get public URL for the image");

  // Generate BlurHash
  const { blurhash } = await generateBlurhash(buffer);

  return {
    publicUrl: data.publicUrl,
    blurhash,
  };
}

// Helper: Generate blurhash from image buffer
async function generateBlurhash(imageBuffer: Buffer) {
  const image = sharp(imageBuffer);
  const { data, info } = await image
    .resize(32, 32, { fit: "inside" }) // Downscale for performance
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4
  );

  return { blurhash };
}
