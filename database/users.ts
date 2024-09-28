type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

type UserWithPasswordHash = User & {
  passwordHash: string;
};
