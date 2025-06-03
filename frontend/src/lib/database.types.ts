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
      momsquestions: {
        Row: {
          id: number
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      answers: {
        Row: {
          id: number
          question_id: number
          user_id: string
          content: string
          is_accepted: boolean
          created_at: string
        }
        Insert: {
          id?: number
          question_id: number
          user_id: string
          content: string
          is_accepted?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          question_id?: number
          user_id?: string
          content?: string
          is_accepted?: boolean
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      question_tags: {
        Row: {
          question_id: number
          tag_id: number
          created_at: string
        }
        Insert: {
          question_id: number
          tag_id: number
          created_at?: string
        }
        Update: {
          question_id?: number
          tag_id?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 