import { Tables } from "./supabase";

export type NovelWithChapters = Tables<'novels'> & {
  chapters: Tables<'chapters'>[]
}