'use server';

import { createClient } from "@/utils/supabase/server";

type UserMetadata = {
  locale?: string;
  theme?: string;
}

export async function updateUserMetadata (metadata: UserMetadata) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  });

  if (error) {
    console.error(error);
    return null;
  }

  return data.user;
}

export async function getUserMetadata() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error(error);
    return null;
  }

  return data.user?.user_metadata;
}