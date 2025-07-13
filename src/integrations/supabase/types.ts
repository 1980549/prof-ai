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
      achievements: {
        Row: {
          badge_color: string | null
          category: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          badge_color?: string | null
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          badge_color?: string | null
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      active_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      addiction_types: {
        Row: {
          color: string | null
          created_at: string | null
          created_by_user: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by_user?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by_user?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      anonymous_posts: {
        Row: {
          content: string
          created_at: string | null
          group_id: string | null
          id: string
          is_anonymous: boolean | null
          is_flagged: boolean | null
          mood_rating: number | null
          reported_count: number | null
          support_count: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          mood_rating?: number | null
          reported_count?: number | null
          support_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          mood_rating?: number | null
          reported_count?: number | null
          support_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          crisis_level: number | null
          emotion_detected: string | null
          id: string
          message_type: string | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          crisis_level?: number | null
          emotion_detected?: string | null
          id?: string
          message_type?: string | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          crisis_level?: number | null
          emotion_detected?: string | null
          id?: string
          message_type?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      common_triggers: {
        Row: {
          category: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      coping_strategies: {
        Row: {
          category: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      crisis_responses: {
        Row: {
          created_at: string | null
          crisis_level: number
          id: string
          requires_human_intervention: boolean | null
          response_template: string
          trigger_keywords: string[]
        }
        Insert: {
          created_at?: string | null
          crisis_level: number
          id?: string
          requires_human_intervention?: boolean | null
          response_template: string
          trigger_keywords: string[]
        }
        Update: {
          created_at?: string | null
          crisis_level?: number
          id?: string
          requires_human_intervention?: boolean | null
          response_template?: string
          trigger_keywords?: string[]
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          created_at: string | null
          date: string | null
          energy_level: number | null
          exercise_minutes: number | null
          id: string
          meditation_minutes: number | null
          motivation_level: number | null
          sleep_hours: number | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          energy_level?: number | null
          exercise_minutes?: number | null
          id?: string
          meditation_minutes?: number | null
          motivation_level?: number | null
          sleep_hours?: number | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          energy_level?: number | null
          exercise_minutes?: number | null
          id?: string
          meditation_minutes?: number | null
          motivation_level?: number | null
          sleep_hours?: number | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      daily_progress: {
        Row: {
          created_at: string | null
          daily_savings: number | null
          date: string
          day_clean: boolean | null
          id: string
          notes: string | null
          sobriety_record_id: string
          streak_day: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_savings?: number | null
          date?: string
          day_clean?: boolean | null
          id?: string
          notes?: string | null
          sobriety_record_id: string
          streak_day?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_savings?: number | null
          date?: string
          day_clean?: boolean | null
          id?: string
          notes?: string | null
          sobriety_record_id?: string
          streak_day?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_progress_sobriety_record_id_fkey"
            columns: ["sobriety_record_id"]
            isOneToOne: false
            referencedRelation: "sobriety_records"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          relationship: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          relationship?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      failed_login_attempts: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          email: string
          id: string
          ip_address: unknown
          last_attempt: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          email: string
          id?: string
          ip_address: unknown
          last_attempt?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          email?: string
          id?: string
          ip_address?: unknown
          last_attempt?: string | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          coping_strategies: string[] | null
          created_at: string | null
          entry_date: string | null
          gratitude_items: string[] | null
          id: string
          mood_after: number | null
          mood_before: number | null
          sobriety_record_id: string | null
          title: string | null
          triggers: string[] | null
          user_id: string
        }
        Insert: {
          content: string
          coping_strategies?: string[] | null
          created_at?: string | null
          entry_date?: string | null
          gratitude_items?: string[] | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          sobriety_record_id?: string | null
          title?: string | null
          triggers?: string[] | null
          user_id: string
        }
        Update: {
          content?: string
          coping_strategies?: string[] | null
          created_at?: string | null
          entry_date?: string | null
          gratitude_items?: string[] | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          sobriety_record_id?: string | null
          title?: string | null
          triggers?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_sobriety_record_id_fkey"
            columns: ["sobriety_record_id"]
            isOneToOne: false
            referencedRelation: "sobriety_records"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_history: {
        Row: {
          created_at: string | null
          entry_date: string
          id: string
          mood_value: number
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entry_date?: string
          id?: string
          mood_value: number
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          entry_date?: string
          id?: string
          mood_value?: number
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications_sent: {
        Row: {
          body: string
          clicked: boolean | null
          delivered: boolean | null
          id: string
          notification_type: string
          sent_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          clicked?: boolean | null
          delivered?: boolean | null
          id?: string
          notification_type: string
          sent_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          clicked?: boolean | null
          delivered?: boolean | null
          id?: string
          notification_type?: string
          sent_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          data_cadastro: string | null
          email: string | null
          id: string
          nome: string | null
        }
        Insert: {
          data_cadastro?: string | null
          email?: string | null
          id: string
          nome?: string | null
        }
        Update: {
          data_cadastro?: string | null
          email?: string | null
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string | null
          device_name: string | null
          device_type: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh_key: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string | null
          device_name?: string | null
          device_type?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh_key: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string | null
          device_name?: string | null
          device_type?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          p256dh_key?: string
          user_id?: string
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          risk_level: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sobriety_records: {
        Row: {
          addiction_type_id: string | null
          best_streak_days: number | null
          created_at: string | null
          current_streak_days: number | null
          daily_cost: number | null
          id: string
          is_active: boolean | null
          motivation_reason: string | null
          personal_goal: string | null
          start_date: string
          total_relapses: number | null
          updated_at: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          addiction_type_id?: string | null
          best_streak_days?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          daily_cost?: number | null
          id?: string
          is_active?: boolean | null
          motivation_reason?: string | null
          personal_goal?: string | null
          start_date: string
          total_relapses?: number | null
          updated_at?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          addiction_type_id?: string | null
          best_streak_days?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          daily_cost?: number | null
          id?: string
          is_active?: boolean | null
          motivation_reason?: string | null
          personal_goal?: string | null
          start_date?: string
          total_relapses?: number | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sobriety_records_addiction_type_id_fkey"
            columns: ["addiction_type_id"]
            isOneToOne: false
            referencedRelation: "addiction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      support_groups: {
        Row: {
          addiction_type_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_private: boolean | null
          name: string
        }
        Insert: {
          addiction_type_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
        }
        Update: {
          addiction_type_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_groups_addiction_type_id_fkey"
            columns: ["addiction_type_id"]
            isOneToOne: false
            referencedRelation: "addiction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      support_resources: {
        Row: {
          availability: string | null
          contact_info: string | null
          country_code: string | null
          description: string | null
          id: string
          is_emergency: boolean | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          availability?: string | null
          contact_info?: string | null
          country_code?: string | null
          description?: string | null
          id?: string
          is_emergency?: boolean | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          availability?: string | null
          contact_info?: string | null
          country_code?: string | null
          description?: string | null
          id?: string
          is_emergency?: boolean | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      sync_status: {
        Row: {
          conflicts_detected: boolean | null
          device_id: string
          id: string
          last_sync: string | null
          sync_errors: Json | null
          sync_version: number | null
          user_id: string
        }
        Insert: {
          conflicts_detected?: boolean | null
          device_id: string
          id?: string
          last_sync?: string | null
          sync_errors?: Json | null
          sync_version?: number | null
          user_id: string
        }
        Update: {
          conflicts_detected?: boolean | null
          device_id?: string
          id?: string
          last_sync?: string | null
          sync_errors?: Json | null
          sync_version?: number | null
          user_id?: string
        }
        Relationships: []
      }
      usage_analytics: {
        Row: {
          event_name: string
          event_properties: Json | null
          id: string
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          event_name: string
          event_properties?: Json | null
          id?: string
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          event_name?: string
          event_properties?: Json | null
          id?: string
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          sobriety_record_id: string | null
          user_id: string
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          sobriety_record_id?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          sobriety_record_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_sobriety_record_id_fkey"
            columns: ["sobriety_record_id"]
            isOneToOne: false
            referencedRelation: "sobriety_records"
            referencedColumns: ["id"]
          },
        ]
      }
      user_backups: {
        Row: {
          backup_type: string
          checksum: string | null
          created_at: string | null
          data_snapshot: Json
          expires_at: string | null
          file_size: number | null
          id: string
          storage_location: string | null
          user_id: string
        }
        Insert: {
          backup_type: string
          checksum?: string | null
          created_at?: string | null
          data_snapshot: Json
          expires_at?: string | null
          file_size?: number | null
          id?: string
          storage_location?: string | null
          user_id: string
        }
        Update: {
          backup_type?: string
          checksum?: string | null
          created_at?: string | null
          data_snapshot?: Json
          expires_at?: string | null
          file_size?: number | null
          id?: string
          storage_location?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_insights: {
        Row: {
          acknowledged_at: string | null
          confidence_score: number | null
          generated_at: string | null
          id: string
          insight_data: Json
          insight_type: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          confidence_score?: number | null
          generated_at?: string | null
          id?: string
          insight_data: Json
          insight_type: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          confidence_score?: number | null
          generated_at?: string | null
          id?: string
          insight_data?: Json
          insight_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reminders: {
        Row: {
          created_at: string | null
          days_of_week: number[] | null
          id: string
          is_active: boolean | null
          message: string | null
          reminder_time: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_time: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_time?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          privacy_level: string | null
          reminder_frequency: string | null
          theme: string | null
          timezone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_level?: string | null
          reminder_frequency?: string | null
          theme?: string | null
          timezone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_level?: string | null
          reminder_frequency?: string | null
          theme?: string | null
          timezone?: string | null
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
