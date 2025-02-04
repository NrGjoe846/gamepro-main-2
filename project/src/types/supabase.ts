export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          theme: string
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
