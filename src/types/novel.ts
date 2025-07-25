import { Tables } from "./supabase";

export type NovelWithChapters = Tables<'novels'> & {
  chapters: Tables<'chapters'>[]
}

export type NovelWithAll = Tables<'novels'> & {
  chapters: Tables<'chapters'>[]
  characters: Tables<'characters'>[]
  events: Tables<'events'>[]
  character_relations: Tables<'character_relations'>[]
}