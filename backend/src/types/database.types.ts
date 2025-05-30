export type User = {
  id: string; // uuid
  email: string;
  created_at: string | null;
};

export type MomsQuestion = {
  id: number;
  user_id: string; // uuid
  content: string | null;
  created_at: string; // timestamp with time zone
};

export type Database = {
  public: {
    Tables: {
      Users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id'>>;
      };
      momsquestions: {
        Row: MomsQuestion;
        Insert: Omit<MomsQuestion, 'id' | 'created_at'>;
        Update: Partial<Omit<MomsQuestion, 'id' | 'created_at'>>;
      };
    };
  };
}; 