import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TypeAccount, User } from '@prisma/client';

@Injectable()
export class PremiumGuard implements CanActivate {
  private checkTypeAccount(user: User) {
    return user.typeOfAccount === TypeAccount.PREMIUM;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.checkTypeAccount(request.user);
  }
}
