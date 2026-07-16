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
          bio: string;
          car: string | null;
          car_year: string | null;
          mods: string | null;
          skill_level: "beginner" | "intermediate" | "advanced" | null;
          instagram: string | null;
          facebook: string | null;
          tiktok: string | null;
          youtube: string | null;
          car_photos: string[];
          is_admin: boolean;
          organizer_status: "none" | "pending" | "standard" | "trusted" | "blocked";
          account_type: "driver" | "organizer" | "both" | null;
          organizer_name: string | null;
          organizer_website: string | null;
          organizer_about: string | null;
          organizer_requested_at: string | null;
          profile_visibility: "public" | "organizers";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          bio?: string;
          car?: string | null;
          car_year?: string | null;
          mods?: string | null;
          skill_level?: "beginner" | "intermediate" | "advanced" | null;
          instagram?: string | null;
          facebook?: string | null;
          tiktok?: string | null;
          youtube?: string | null;
          car_photos?: string[];
          is_admin?: boolean;
          organizer_status?: "none" | "pending" | "standard" | "trusted" | "blocked";
          account_type?: "driver" | "organizer" | "both" | null;
          organizer_name?: string | null;
          organizer_website?: string | null;
          organizer_about?: string | null;
          organizer_requested_at?: string | null;
          profile_visibility?: "public" | "organizers";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string;
          car?: string | null;
          car_year?: string | null;
          mods?: string | null;
          skill_level?: "beginner" | "intermediate" | "advanced" | null;
          instagram?: string | null;
          facebook?: string | null;
          tiktok?: string | null;
          youtube?: string | null;
          car_photos?: string[];
          is_admin?: boolean;
          organizer_status?: "none" | "pending" | "standard" | "trusted" | "blocked";
          account_type?: "driver" | "organizer" | "both" | null;
          organizer_name?: string | null;
          organizer_website?: string | null;
          organizer_about?: string | null;
          organizer_requested_at?: string | null;
          profile_visibility?: "public" | "organizers";
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          name: string;
          series: string | null;
          date: string;
          end_date: string | null;
          location: string;
          country: string;
          track: string;
          lat: number;
          lng: number;
          category: "official" | "grassroots" | "proam" | "practice";
          cage_required: boolean;
          tire_size: "205" | "225" | "unlimited";
          skill_level: "beginner" | "intermediate" | "advanced" | "all";
          description: string;
          event_url: string | null;
          image_url: string | null;
          media_urls: string[];
          safety_requirements: string;
          required_equipment: string[];
          accepts_media: boolean;
          price: string | null;
          is_hot: boolean;
          participation: "drive" | "watch" | "both";
          organizer: string;
          google_place_id: string | null;
          google_rating: number | null;
          google_reviews_count: number | null;
          phone: string | null;
          website: string | null;
          source: "manual" | "outscraper" | "user_submitted";
          status: "approved" | "pending" | "rejected";
          submitted_by: string | null;
          max_participants: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          series?: string | null;
          date: string;
          end_date?: string | null;
          location: string;
          country?: string;
          track?: string;
          lat: number;
          lng: number;
          category?: "official" | "grassroots" | "proam" | "practice";
          cage_required?: boolean;
          tire_size?: "205" | "225" | "unlimited";
          skill_level?: "beginner" | "intermediate" | "advanced" | "all";
          description?: string;
          event_url?: string | null;
          image_url?: string | null;
          media_urls?: string[];
          safety_requirements?: string;
          required_equipment?: string[];
          accepts_media?: boolean;
          price?: string | null;
          is_hot?: boolean;
          participation?: "drive" | "watch" | "both";
          organizer?: string;
          google_place_id?: string | null;
          google_rating?: number | null;
          google_reviews_count?: number | null;
          phone?: string | null;
          website?: string | null;
          source?: "manual" | "outscraper" | "user_submitted";
          status?: "approved" | "pending" | "rejected";
          submitted_by?: string | null;
          max_participants?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          series?: string | null;
          date?: string;
          end_date?: string | null;
          location?: string;
          country?: string;
          track?: string;
          lat?: number;
          lng?: number;
          category?: "official" | "grassroots" | "proam" | "practice";
          cage_required?: boolean;
          tire_size?: "205" | "225" | "unlimited";
          skill_level?: "beginner" | "intermediate" | "advanced" | "all";
          description?: string;
          event_url?: string | null;
          image_url?: string | null;
          media_urls?: string[];
          safety_requirements?: string;
          required_equipment?: string[];
          accepts_media?: boolean;
          price?: string | null;
          is_hot?: boolean;
          participation?: "drive" | "watch" | "both";
          organizer?: string;
          status?: "approved" | "pending" | "rejected";
          submitted_by?: string | null;
          max_participants?: number | null;
          updated_at?: string;
        };
      };
      driver_emergency_contacts: {
        Row: {
          user_id: string;
          contact_name: string;
          contact_phone: string;
          contact_relationship: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          contact_name: string;
          contact_phone: string;
          contact_relationship?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          contact_name?: string;
          contact_phone?: string;
          contact_relationship?: string | null;
          updated_at?: string;
        };
      };
      driver_cars: {
        Row: {
          id: string;
          user_id: string;
          car: string;
          car_year: string | null;
          horsepower: number | null;
          mods: string | null;
          photos: string[];
          video_urls: string[];
          equipment: string[];
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          car: string;
          car_year?: string | null;
          horsepower?: number | null;
          mods?: string | null;
          photos?: string[];
          video_urls?: string[];
          equipment?: string[];
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          car?: string;
          car_year?: string | null;
          horsepower?: number | null;
          mods?: string | null;
          photos?: string[];
          video_urls?: string[];
          equipment?: string[];
          is_primary?: boolean;
        };
      };
      event_documents: {
        Row: {
          id: string;
          event_id: string;
          uploaded_by: string;
          name: string;
          file_path: string;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          uploaded_by: string;
          name: string;
          file_path: string;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: {
          name?: string;
        };
      };
      event_links: {
        Row: {
          id: string;
          event_id: string;
          added_by: string;
          label: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          added_by: string;
          label: string;
          url: string;
          created_at?: string;
        };
        Update: {
          label?: string;
          url?: string;
        };
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
          status: "pending" | "approved" | "rejected";
          message: string | null;
          car_id: string | null;
          role: "driver" | "media";
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status: "pending" | "approved" | "rejected";
          message?: string | null;
          car_id?: string | null;
          role?: "driver" | "media";
          created_at?: string;
        };
        Update: {
          status?: "pending" | "approved" | "rejected";
          car_id?: string | null;
          message?: string | null;
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
          image_url: string | null;
          media_urls: string[];
          safety_requirements: string;
          required_equipment: string[];
          accepts_media: boolean;
          lat: number | null;
          lng: number | null;
          track: string;
          country: string;
          series: string | null;
          price: string | null;
          max_participants: number | null;
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
          image_url?: string | null;
          media_urls?: string[];
          safety_requirements?: string;
          required_equipment?: string[];
          accepts_media?: boolean;
          lat?: number | null;
          lng?: number | null;
          organizer: string;
          contact_email: string;
          track?: string;
          country?: string;
          series?: string | null;
          price?: string | null;
          max_participants?: number | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          name?: string;
          date?: string;
          end_date?: string | null;
          location?: string;
          category?: string;
          cage_required?: boolean;
          tire_size?: string;
          skill_level?: string;
          participation?: string;
          description?: string;
          event_url?: string | null;
          image_url?: string | null;
          media_urls?: string[];
          safety_requirements?: string;
          required_equipment?: string[];
          accepts_media?: boolean;
          lat?: number | null;
          lng?: number | null;
          organizer?: string;
          contact_email?: string;
          track?: string;
          country?: string;
          series?: string | null;
          price?: string | null;
          max_participants?: number | null;
          status?: "pending" | "approved" | "rejected";
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_driver_stats: {
        Args: { driver_ids: string[] };
        Returns: { user_id: string; events_attended: number; upcoming_events: number }[];
      };
      get_public_profiles: {
        Args: { profile_ids: string[] };
        Returns: { id: string; username: string; avatar_url: string | null }[];
      };
      can_view_profile: {
        Args: { profile_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
