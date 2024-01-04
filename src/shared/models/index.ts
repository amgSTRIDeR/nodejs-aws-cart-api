import { Request } from 'express';
import { User } from 'src/users';

export interface AppRequest extends Request {
  statusCode: any;
  user?: User;
}