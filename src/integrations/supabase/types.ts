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
      conquistas: {
        Row: {
          badge: string | null
          data_conquista: string | null
          descricao: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          badge?: string | null
          data_conquista?: string | null
          descricao?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          badge?: string | null
          data_conquista?: string | null
          descricao?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conquistas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      exercicios: {
        Row: {
          acertou: boolean | null
          criado_em: string | null
          dificuldade: string | null
          enunciado: string | null
          feedback: string | null
          id: number
          materia: string | null
          moedas_ganhas: number | null
          resolucao_usuario: string | null
          resposta_correta: string | null
          tentativas: number | null
          user_id: string | null
        }
        Insert: {
          acertou?: boolean | null
          criado_em?: string | null
          dificuldade?: string | null
          enunciado?: string | null
          feedback?: string | null
          id?: number
          materia?: string | null
          moedas_ganhas?: number | null
          resolucao_usuario?: string | null
          resposta_correta?: string | null
          tentativas?: number | null
          user_id?: string | null
        }
        Update: {
          acertou?: boolean | null
          criado_em?: string | null
          dificuldade?: string | null
          enunciado?: string | null
          feedback?: string | null
          id?: number
          materia?: string | null
          moedas_ganhas?: number | null
          resolucao_usuario?: string | null
          resposta_correta?: string | null
          tentativas?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercicios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      historico: {
        Row: {
          audio_url: string | null
          criado_em: string | null
          id: number
          imagem_url: string | null
          materia: string | null
          perfil: string | null
          pergunta: string | null
          resposta: string | null
          resultado: Json | null
          tipo: string | null
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          criado_em?: string | null
          id?: number
          imagem_url?: string | null
          materia?: string | null
          perfil?: string | null
          pergunta?: string | null
          resposta?: string | null
          resultado?: Json | null
          tipo?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          criado_em?: string | null
          id?: number
          imagem_url?: string | null
          materia?: string | null
          perfil?: string | null
          pergunta?: string | null
          resposta?: string | null
          resultado?: Json | null
          tipo?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      limites: {
        Row: {
          atualizado_em: string | null
          id: number
          tipo_limite: string | null
          user_id: string | null
          valor_atual: number | null
          valor_maximo: number | null
        }
        Insert: {
          atualizado_em?: string | null
          id?: number
          tipo_limite?: string | null
          user_id?: string | null
          valor_atual?: number | null
          valor_maximo?: number | null
        }
        Update: {
          atualizado_em?: string | null
          id?: number
          tipo_limite?: string | null
          user_id?: string | null
          valor_atual?: number | null
          valor_maximo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "limites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      missoes: {
        Row: {
          descricao: string | null
          fim: string | null
          id: number
          inicio: string | null
          recompensa_moedas: number | null
          status: string | null
          titulo: string | null
          user_id: string | null
        }
        Insert: {
          descricao?: string | null
          fim?: string | null
          id?: number
          inicio?: string | null
          recompensa_moedas?: number | null
          status?: string | null
          titulo?: string | null
          user_id?: string | null
        }
        Update: {
          descricao?: string | null
          fim?: string | null
          id?: number
          inicio?: string | null
          recompensa_moedas?: number | null
          status?: string | null
          titulo?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "missoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          conquistas: Json | null
          created_at: string | null
          id: string
          idade: number | null
          moedas: number | null
          nome: string | null
          objetivo: string | null
          regiao: string | null
          serie: string | null
          tipo: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          conquistas?: Json | null
          created_at?: string | null
          id?: string
          idade?: number | null
          moedas?: number | null
          nome?: string | null
          objetivo?: string | null
          regiao?: string | null
          serie?: string | null
          tipo: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          conquistas?: Json | null
          created_at?: string | null
          id?: string
          idade?: number | null
          moedas?: number | null
          nome?: string | null
          objetivo?: string | null
          regiao?: string | null
          serie?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      uploads: {
        Row: {
          contexto: string | null
          criado_em: string | null
          id: number
          tipo: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          contexto?: string | null
          criado_em?: string | null
          id?: number
          tipo?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          contexto?: string | null
          criado_em?: string | null
          id?: number
          tipo?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
