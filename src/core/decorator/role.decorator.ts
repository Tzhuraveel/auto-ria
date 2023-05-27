import { SetMetadata } from '@nestjs/common';
import { Roles } from '@prisma/client';

export const RolesAccess = (...roles: Roles[]) => SetMetadata('roles', roles);
