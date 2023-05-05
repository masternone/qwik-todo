export interface DataBase {
  public: {
    Tables: {
      ToDo: {
        Row: {
          id: string;
          created_at: string;
          todo: string;
          complete: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          todo: string;
          complete?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          todo?: string;
          complete?: boolean;
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

export type todoType = DataBase['public']['Tables']['ToDo']['Row'];
