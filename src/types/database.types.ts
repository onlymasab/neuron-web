export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          avatar_url: string | null;
          email: string;
          role_id: string | null;
          full_name: string | null;
        };
        Insert: {
          id: string;
          avatar_url?: string | null;
          email: string;
          role_id?: string | null;
          full_name?: string | null;
        };
        Update: {
          id?: string;
          avatar_url?: string | null;
          email?: string;
          role_id?: string | null;
          full_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_user_id";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}