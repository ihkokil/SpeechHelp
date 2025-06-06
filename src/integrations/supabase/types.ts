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
      activity_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_2fa: {
        Row: {
          admin_user_id: string
          created_at: string
          is_enabled: boolean
          secret_key: string
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          is_enabled?: boolean
          secret_key: string
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          is_enabled?: boolean
          secret_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_2fa_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: true
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_activity_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      admin_role_permissions: {
        Row: {
          created_at: string | null
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "admin_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "admin_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          admin_user_id: string
          created_at: string | null
          id: string
          setting_category: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          id?: string
          setting_category: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          id?: string
          setting_category?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_user_roles: {
        Row: {
          admin_user_id: string
          created_at: string | null
          role_id: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          role_id: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_user_roles_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "admin_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          allowed_ip_addresses: string[] | null
          created_at: string
          email: string
          failed_login_attempts: number
          hashed_password: string
          id: string
          is_active: boolean
          is_super_admin: boolean
          last_login: string | null
          updated_at: string
          username: string
        }
        Insert: {
          allowed_ip_addresses?: string[] | null
          created_at?: string
          email: string
          failed_login_attempts?: number
          hashed_password: string
          id?: string
          is_active?: boolean
          is_super_admin?: boolean
          last_login?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          allowed_ip_addresses?: string[] | null
          created_at?: string
          email?: string
          failed_login_attempts?: number
          hashed_password?: string
          id?: string
          is_active?: boolean
          is_super_admin?: boolean
          last_login?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      password_reset_otps: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          is_used: boolean | null
          otp_code: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          is_used?: boolean | null
          otp_code: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean | null
          otp_code?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          billing_period: string | null
          created_at: string | null
          currency: string | null
          id: string
          payment_date: string | null
          plan_type: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          billing_period?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          plan_type: string
          status: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          billing_period?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          plan_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          billing_city: string | null
          billing_country: string | null
          billing_state: string | null
          billing_street: string | null
          billing_zip: string | null
          brand: string
          card_holder: string
          card_type: string
          created_at: string | null
          expiry_month: number
          expiry_year: number
          id: string
          is_default: boolean | null
          last4: string
          stripe_payment_method_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_city?: string | null
          billing_country?: string | null
          billing_state?: string | null
          billing_street?: string | null
          billing_zip?: string | null
          brand: string
          card_holder: string
          card_type: string
          created_at?: string | null
          expiry_month: number
          expiry_year: number
          id?: string
          is_default?: boolean | null
          last4: string
          stripe_payment_method_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_city?: string | null
          billing_country?: string | null
          billing_state?: string | null
          billing_street?: string | null
          billing_zip?: string | null
          brand?: string
          card_holder?: string
          card_type?: string
          created_at?: string | null
          expiry_month?: number
          expiry_year?: number
          id?: string
          is_default?: boolean | null
          last4?: string
          stripe_payment_method_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_code: string | null
          created_at: string
          first_name: string | null
          id: string
          is_active: boolean | null
          is_admin: boolean | null
          last_name: string | null
          phone: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_amount: number | null
          subscription_currency: string | null
          subscription_end_date: string | null
          subscription_period: string | null
          subscription_plan: string | null
          subscription_price_id: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_amount?: number | null
          subscription_currency?: string | null
          subscription_end_date?: string | null
          subscription_period?: string | null
          subscription_plan?: string | null
          subscription_price_id?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_amount?: number | null
          subscription_currency?: string | null
          subscription_end_date?: string | null
          subscription_period?: string | null
          subscription_plan?: string | null
          subscription_price_id?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      speeches: {
        Row: {
          content: string
          created_at: string
          id: string
          speech_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          speech_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          speech_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_2fa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_enabled: boolean
          secret_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          secret_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          secret_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      admin_update_user_profile: {
        Args:
          | {
              user_id_param: string
              display_name: string
              user_email: string
              phone_number: string
              is_active_status: boolean
              user_metadata?: Json
            }
          | {
              user_id_param: string
              first_name_param: string
              last_name_param: string
              user_email: string
              phone_number: string
              is_active_status: boolean
              user_metadata?: Json
            }
          | {
              user_id_param: string
              first_name_param: string
              last_name_param: string
              user_email: string
              phone_number?: string
              street_address_param?: string
              city_param?: string
              state_param?: string
              zip_code_param?: string
              country_param?: string
              is_active_status?: boolean
            }
        Returns: Json
      }
      authenticate_admin: {
        Args: { email_input: string; password_input: string }
        Returns: {
          id: string
          email: string
          username: string
          is_super_admin: boolean
        }[]
      }
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_first_admin: {
        Args: {
          email_input: string
          username_input: string
          password_input: string
        }
        Returns: string
      }
      generate_backup_codes: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_admin_settings: {
        Args: { category_filter?: string }
        Returns: {
          setting_key: string
          setting_value: Json
          setting_category: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          admin_id_input: string
          action_input: string
          entity_type_input: string
          entity_id_input: string
          details_input: Json
          ip_address_input?: string
          user_agent_input?: string
        }
        Returns: string
      }
      toggle_user_admin_access: {
        Args: { user_id_param: string; enable_admin: boolean }
        Returns: Json
      }
      toggle_user_admin_status: {
        Args: {
          user_id_param: string
          new_admin_status: boolean
          new_admin_role?: string
        }
        Returns: Json
      }
      update_user_admin_status: {
        Args: {
          user_id: string
          is_admin_status?: boolean
          admin_role_value?: string
          permissions_value?: Json
        }
        Returns: Json
      }
      update_user_subscription: {
        Args: { user_id: string; plan: string; end_date: string }
        Returns: Json
      }
      update_user_subscription_after_payment: {
        Args: {
          user_id_param: string
          plan_type_param: string
          billing_period_param: string
          stripe_customer_id_param: string
          stripe_subscription_id_param: string
          amount_param: number
          price_id_param: string
        }
        Returns: Json
      }
      upsert_admin_setting: {
        Args: {
          setting_key_param: string
          setting_value_param: Json
          setting_category_param: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
