import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existe = await this.usersRepository.findOneBy({ email });
    if (existe) throw new ConflictException('El email ya está registrado');

    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, email, password: hash });
    const saved = await this.usersRepository.save(user);

    return { message: 'Usuario registrado', id: saved.id };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { access_token: token };
  }
}
