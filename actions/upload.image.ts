"use server";

import { supabase } from "@/lib/supabaseClient.ts";



export async function uploadImage(file: File | null) {
  if (!file) throw new Error("No file selected");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `menu-items/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload error:", error.message);
    throw new Error(error.message);
  }

  // Get the public URL for the uploaded image
  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  if (!data) throw new Error("Failed to get public URL for the image");

  return data.publicUrl;
}
