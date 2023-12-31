import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { User } from 'src/users';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(name: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByName(name);

    if (user) {
      return user;
    }

    return this.usersService.createOne({ name, password });
  }

  login(user: User, type) {
    const LOGIN_MAP = {
      basic: this.loginBasic,
      default: this.loginBasic,
    };
    const login = LOGIN_MAP[type];

    return login ? login(user) : LOGIN_MAP.default(user);
  }

  loginBasic(user: User) {
    // const payload = { username: user.name, sub: user.id };
    console.log(user);

    function encodeUserToken(user) {
      const { id, name, password } = user;
      const buf = Buffer.from([name, password].join(':'), 'utf8');

      return buf.toString('base64');
    }

    return {
      token_type: 'Basic',
      access_token: encodeUserToken(user),
    };
  }
}