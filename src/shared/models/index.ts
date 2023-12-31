import { Request } from 'express';
import { User } from 'src/users';

export interface AppRequest extends Request {
  user?: User;
}