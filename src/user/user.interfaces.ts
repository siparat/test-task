import { User } from '@prisma/client';
import { PartialFields } from '../common/common.types';

export type IUserEntity = Omit<PartialFields<User, 'id' | 'avatar' | 'lastName' | 'sex'>, 'createdAt' | 'updatedAt'>;
