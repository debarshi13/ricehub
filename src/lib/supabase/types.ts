export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          github_url: string | null;
          buymeacoffee: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          github_url?: string | null;
          buymeacoffee?: string | null;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          github_url?: string | null;
          buymeacoffee?: string | null;
        };
      };
      rices: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          description: string;
          wm: string;
          distro: string;
          tags: string[];
          dots_url: string | null;
          downloads: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description?: string;
          wm: string;
          distro?: string;
          tags?: string[];
          dots_url?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          wm?: string;
          distro?: string;
          tags?: string[];
          dots_url?: string | null;
        };
      };
      screenshots: {
        Row: {
          id: string;
          rice_id: string;
          storage_path: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          rice_id: string;
          storage_path: string;
          display_order?: number;
        };
        Update: {
          storage_path?: string;
          display_order?: number;
        };
      };
      tips: {
        Row: {
          id: string;
          rice_id: string;
          tipper_id: string | null;
          amount: number;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rice_id: string;
          tipper_id?: string | null;
          amount?: number;
          message?: string | null;
        };
        Update: {
          amount?: number;
          message?: string | null;
        };
      };
    };
  };
};

export type Rice = Database["public"]["Tables"]["rices"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
  screenshots: Database["public"]["Tables"]["screenshots"]["Row"][];
  tip_count: number;
};
