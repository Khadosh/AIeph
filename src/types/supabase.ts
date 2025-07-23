export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chapters: {
        Row: {
          author_notes: string | null
          character_count: number | null
          content: string | null
          created_at: string | null
          id: string
          last_edited_at: string | null
          novel_id: string | null
          order_index: number
          reading_time_minutes: number | null
          status: Database["public"]["Enums"]["chapter_status"] | null
          summary: string | null
          title: string
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          author_notes?: string | null
          character_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          last_edited_at?: string | null
          novel_id?: string | null
          order_index: number
          reading_time_minutes?: number | null
          status?: Database["public"]["Enums"]["chapter_status"] | null
          summary?: string | null
          title: string
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          author_notes?: string | null
          character_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          last_edited_at?: string | null
          novel_id?: string | null
          order_index?: number
          reading_time_minutes?: number | null
          status?: Database["public"]["Enums"]["chapter_status"] | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novel_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      character_relations: {
        Row: {
          character_a_id: string | null
          character_b_id: string | null
          context: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          summary: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          character_a_id?: string | null
          character_b_id?: string | null
          context?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          summary?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          character_a_id?: string | null
          character_b_id?: string | null
          context?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          summary?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_relations_character_a_id_fkey"
            columns: ["character_a_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_relations_character_b_id_fkey"
            columns: ["character_b_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string
          novel_id: string
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name: string
          novel_id: string
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string
          novel_id?: string
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novel_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      event_characters: {
        Row: {
          character_id: string
          event_id: string
        }
        Insert: {
          character_id: string
          event_id: string
        }
        Update: {
          character_id?: string
          event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_characters_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_characters_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          chapter_id: string | null
          created_at: string | null
          date: string | null
          id: string
          metadata: Json | null
          novel_id: string
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          metadata?: Json | null
          novel_id: string
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          metadata?: Json | null
          novel_id?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters_ordered"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "public_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novel_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      novels: {
        Row: {
          created_at: string
          description: string | null
          genre: string | null
          id: string
          status: Database["public"]["Enums"]["novel_status"] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          status?: Database["public"]["Enums"]["novel_status"] | null
          title: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          status?: Database["public"]["Enums"]["novel_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      chapters_ordered: {
        Row: {
          author_notes: string | null
          character_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          last_edited_at: string | null
          novel_author_id: string | null
          novel_id: string | null
          novel_status: Database["public"]["Enums"]["novel_status"] | null
          novel_title: string | null
          order_index: number | null
          reading_time_minutes: number | null
          status: Database["public"]["Enums"]["chapter_status"] | null
          summary: string | null
          title: string | null
          updated_at: string | null
          word_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novel_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      novel_stats: {
        Row: {
          id: string | null
          last_chapter_update: string | null
          published_chapters: number | null
          published_words: number | null
          status: Database["public"]["Enums"]["novel_status"] | null
          title: string | null
          total_chapters: number | null
          total_reading_time: number | null
          total_words: number | null
          user_id: string | null
        }
        Relationships: []
      }
      public_chapters: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          novel_description: string | null
          novel_id: string | null
          novel_title: string | null
          order_index: number | null
          reading_time_minutes: number | null
          summary: string | null
          title: string | null
          updated_at: string | null
          word_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novel_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_next_chapter_order: {
        Args: { novel_uuid: string }
        Returns: number
      }
    }
    Enums: {
      chapter_status:
        | "draft"
        | "in_progress"
        | "completed"
        | "published"
        | "needs_review"
      novel_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      chapter_status: [
        "draft",
        "in_progress",
        "completed",
        "published",
        "needs_review",
      ],
      novel_status: ["draft", "published", "archived"],
    },
  },
} as const
