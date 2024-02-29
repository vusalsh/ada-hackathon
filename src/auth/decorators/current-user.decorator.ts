import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';


export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): User => {
    return context.switchToHttp().getRequest().user;
  },
);
