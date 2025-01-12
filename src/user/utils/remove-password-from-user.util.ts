import { User } from '@prisma/__generated__';

export const removePasswordFromUser = (user: User | null) => {
  if (!user) return null;

  const { password, ...userData } = user;

  return userData;
};
