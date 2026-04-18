export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.5' };
  public: {
    Tables: {
      profiles: {
        Row: {
          age: number;
          avatar_url: string | null;
          created_at: string | null;
          custom_instructions: string | null;
          first_name: string;
          id: string;
          last_name: string;
          nickname: string | null;
          preferred_dialect: string | null;
          terms_accepted_at: string;
          tone: string | null;
          updated_at: string | null;
        };
        Insert: {
          age: number;
          avatar_url?: string | null;
          created_at?: string | null;
          custom_instructions?: string | null;
          first_name: string;
          id: string;
          last_name: string;
          nickname?: string | null;
          preferred_dialect?: string | null;
          terms_accepted_at?: string;
          tone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          age?: number;
          avatar_url?: string | null;
          created_at?: string | null;
          custom_instructions?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string;
          nickname?: string | null;
          preferred_dialect?: string | null;
          terms_accepted_at?: string;
          tone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          created_at: string | null;
          dialect_used: string | null;
          id: string;
          mode: string;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          dialect_used?: string | null;
          id?: string;
          mode: string;
          title?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          dialect_used?: string | null;
          id?: string;
          mode?: string;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      generated_images: {
        Row: {
          arabic_prompt: string;
          conversation_id: string;
          cost_usd: number | null;
          created_at: string | null;
          english_prompt: string;
          id: string;
          image_storage_path: string;
          image_url: string;
          user_id: string;
        };
        Insert: {
          arabic_prompt: string;
          conversation_id: string;
          cost_usd?: number | null;
          created_at?: string | null;
          english_prompt: string;
          id?: string;
          image_storage_path: string;
          image_url: string;
          user_id: string;
        };
        Update: {
          arabic_prompt?: string;
          conversation_id?: string;
          cost_usd?: number | null;
          created_at?: string | null;
          english_prompt?: string;
          id?: string;
          image_storage_path?: string;
          image_url?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          cost_usd: number | null;
          created_at: string | null;
          id: string;
          latency_ms: number | null;
          model_used: string | null;
          role: string;
          tokens_input: number | null;
          tokens_output: number | null;
        };
        Insert: {
          content: string;
          conversation_id: string;
          cost_usd?: number | null;
          created_at?: string | null;
          id?: string;
          latency_ms?: number | null;
          model_used?: string | null;
          role: string;
          tokens_input?: number | null;
          tokens_output?: number | null;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          cost_usd?: number | null;
          created_at?: string | null;
          id?: string;
          latency_ms?: number | null;
          model_used?: string | null;
          role?: string;
          tokens_input?: number | null;
          tokens_output?: number | null;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          count: number | null;
          id: string;
          mode: string;
          reset_at: string | null;
          user_id: string;
        };
        Insert: {
          count?: number | null;
          id?: string;
          mode: string;
          reset_at?: string | null;
          user_id: string;
        };
        Update: {
          count?: number | null;
          id?: string;
          mode?: string;
          reset_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_integrations: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          status: string;
          config: Json | null;
          connected_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          status?: string;
          config?: Json | null;
          connected_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          status?: string;
          config?: Json | null;
          connected_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Mode = 'WRITER' | 'CODER' | 'DESIGNER';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type GeneratedImage = Database['public']['Tables']['generated_images']['Row'];
export type UserIntegration = Database['public']['Tables']['user_integrations']['Row'];

export type Dialect = 'MSA' | 'LEVANTINE' | 'GULF' | 'EGYPTIAN' | 'MAGHREBI';
