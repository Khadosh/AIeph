
'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createChapter(novelId: string) {
  const supabase = await createClient();

  // First, get the highest order_index for the given novel_id
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('chapters')
    .select('order_index')
    .eq('novel_id', novelId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single();

  if (maxOrderError && maxOrderError.code !== 'PGRST116') { // Ignore 'range not found' error
    console.error('Error fetching max order_index:', maxOrderError);
    return;
  }

  const newOrderIndex = maxOrderData ? maxOrderData.order_index + 1 : 1;

  const { data, error } = await supabase
    .from('chapters')
    .insert([
      {
        novel_id: novelId,
        title: '',
        content: {},
        order_index: newOrderIndex,
      },
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating chapter:', error);
    return;
  }

  // Revalidate the novel page to show the new chapter in the list
  revalidatePath(`/creator/novel/${novelId}`);

  // Redirect to the new chapter's edit page
  redirect(`/creator/novel/${novelId}/chapter/${data.id}`);
}
