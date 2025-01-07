import { User } from '@prisma/__generated__';

export type AuthResult = Omit<User, 'password'>;
