export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          car: string | null;
          car_year: string | null;
          mods: string | null;
          skill_level: "beginner" | "intermediate" | "advanced" | null;
          instagram: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          car?: string | null;
          car_year?: string | null;
          mods?: string | null;
          skill_level?: "beginner" | "intermediate" | "advanced" | null;
          instagram?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          car?: string | null;
          car_year?: string | null;
          mods?: string | null;
          skill_level?: "beginner" | "intermediate" | "advanced" | null;
          instagram?: string | null;
          updated_at?: string;
        };
      };
      forum_categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          icon?: string;
          color?: string;
          sort_order?: number;
        };
      };
      forum_threads: {
        Row: {
          id: string;
          category_id: string;
          author_id: string;
          title: string;
          body: string;
          tag: string;
          pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          author_id: string;
          title: string;
          body: string;
          tag: string;
          pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          title?: string;
          body?: string;
          tag?: string;
          pinned?: boolean;
          updated_at?: string;
        };
      };
      forum_replies: {
        Row: {
          id: string;
          thread_id: string;
          author_id: string;
          parent_reply_id: string | null;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          author_id: string;
          parent_reply_id?: string | null;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          thread_id: string | null;
          reply_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          thread_id?: string | null;
          reply_id?: string | null;
          created_at?: string;
        };
        Update: never;
      };
      event_comments: {
        Row: {
          id: string;
          event_id: string;
          author_id: string;
          parent_comment_id: string | null;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          author_id: string;
          parent_comment_id?: string | null;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          updated_at?: string;
        };
      };
      event_comment_likes: {
        Row: {
          id: string;
          user_id: string;
          comment_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          comment_id: string;
          created_at?: string;
        };
        Update: never;
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: "going" | "interested";
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status: "going" | "interested";
          created_at?: string;
        };
        Update: {
          status?: "going" | "interested";
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "reply" | "like" | "mention" | "event" | "system";
          title: string;
          body: string;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "reply" | "like" | "mention" | "event" | "system";
          title: string;
          body: string;
          link?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          keys_p256dh: string;
          keys_auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          keys_p256dh: string;
          keys_auth: string;
          created_at?: string;
        };
        Update: never;
      };
      email_preferences: {
        Row: {
          id: string;
          user_id: string;
          reply_notifications: boolean;
          like_notifications: boolean;
          weekly_digest: boolean;
          event_reminders: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reply_notifications?: boolean;
          like_notifications?: boolean;
          weekly_digest?: boolean;
          event_reminders?: boolean;
          created_at?: string;
        };
        Update: {
          reply_notifications?: boolean;
          like_notifications?: boolean;
          weekly_digest?: boolean;
          event_reminders?: boolean;
        };
      };
      submitted_events: {
        Row: {
          id: string;
          submitted_by: string;
          name: string;
          date: string;
          end_date: string | null;
          location: string;
          category: string;
          cage_required: boolean;
          tire_size: string;
          skill_level: string;
          participation: string;
          description: string;
          event_url: string | null;
          organizer: string;
          contact_email: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          submitted_by: string;
          name: string;
          date: string;
          end_date?: string | null;
          location: string;
          category: string;
          cage_required?: boolean;
          tire_size?: string;
          skill_level?: string;
          participation?: string;
          description?: string;
          event_url?: string | null;
          organizer: string;
          contact_email: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          status?: "pending" | "approved" | "rejected";
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
