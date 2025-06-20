export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      mfa_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          mfa_type: Database["public"]["Enums"]["mfa_type"]
          phone_number: string | null
          secret_key: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          mfa_type: Database["public"]["Enums"]["mfa_type"]
          phone_number?: string | null
          secret_key?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          mfa_type?: Database["public"]["Enums"]["mfa_type"]
          phone_number?: string | null
          secret_key?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_settings: {
        Row: {
          ad_blocker_enabled: boolean | null
          created_at: string | null
          data_collection_consent: boolean | null
          id: string
          secure_dns_enabled: boolean | null
          tracker_blocker_enabled: boolean | null
          updated_at: string | null
          user_id: string | null
          vpn_enabled: boolean | null
        }
        Insert: {
          ad_blocker_enabled?: boolean | null
          created_at?: string | null
          data_collection_consent?: boolean | null
          id?: string
          secure_dns_enabled?: boolean | null
          tracker_blocker_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          vpn_enabled?: boolean | null
        }
        Update: {
          ad_blocker_enabled?: boolean | null
          created_at?: string | null
          data_collection_consent?: boolean | null
          id?: string
          secure_dns_enabled?: boolean | null
          tracker_blocker_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          vpn_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          device_id: string | null
          email: string
          full_name: string | null
          id: string
          last_active: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          subscription_expires_at: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          email: string
          full_name?: string | null
          id: string
          last_active?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_active?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      secure_files: {
        Row: {
          created_at: string | null
          encryption_key_hash: string
          file_name: string
          file_size: number | null
          id: string
          is_deleted: boolean | null
          mime_type: string | null
          storage_path: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          encryption_key_hash: string
          file_name: string
          file_size?: number | null
          id?: string
          is_deleted?: boolean | null
          mime_type?: string | null
          storage_path: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          encryption_key_hash?: string
          file_name?: string
          file_size?: number | null
          id?: string
          is_deleted?: boolean | null
          mime_type?: string | null
          storage_path?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "secure_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit: {
        Row: {
          created_at: string | null
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      threat_logs: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          id: string
          resolved_at: string | null
          severity_level: number | null
          source_ip: unknown | null
          threat_data: Json
          threat_status: Database["public"]["Enums"]["threat_status"] | null
          threat_type: Database["public"]["Enums"]["threat_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          resolved_at?: string | null
          severity_level?: number | null
          source_ip?: unknown | null
          threat_data: Json
          threat_status?: Database["public"]["Enums"]["threat_status"] | null
          threat_type: Database["public"]["Enums"]["threat_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          resolved_at?: string | null
          severity_level?: number | null
          source_ip?: unknown | null
          threat_data?: Json
          threat_status?: Database["public"]["Enums"]["threat_status"] | null
          threat_type?: Database["public"]["Enums"]["threat_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threat_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      threat_patterns: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          pattern_data: Json
          pattern_name: string
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pattern_data: Json
          pattern_name: string
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pattern_data?: Json
          pattern_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vpn_sessions: {
        Row: {
          bytes_transferred: number | null
          connected_at: string | null
          disconnected_at: string | null
          id: string
          is_active: boolean | null
          server_location: string
          user_id: string | null
        }
        Insert: {
          bytes_transferred?: number | null
          connected_at?: string | null
          disconnected_at?: string | null
          id?: string
          is_active?: boolean | null
          server_location: string
          user_id?: string | null
        }
        Update: {
          bytes_transferred?: number | null
          connected_at?: string | null
          disconnected_at?: string | null
          id?: string
          is_active?: boolean | null
          server_location?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vpn_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
      mfa_type: "sms" | "email" | "authenticator"
      threat_status: "active" | "resolved" | "investigating"
      threat_type:
        | "malware"
        | "phishing"
        | "suspicious_activity"
        | "network_anomaly"
      user_role: "admin" | "premium_user" | "free_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mfa_type: ["sms", "email", "authenticator"],
      threat_status: ["active", "resolved", "investigating"],
      threat_type: [
        "malware",
        "phishing",
        "suspicious_activity",
        "network_anomaly",
      ],
      user_role: ["admin", "premium_user", "free_user"],
    },
  },
} as const
