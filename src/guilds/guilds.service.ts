import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guild } from './guild.entity';

@Injectable()
export class GuildsService {
  constructor(
    @InjectRepository(Guild)
    private readonly guildsRepository: Repository<Guild>,
  ) {}

  findAll(): Promise<Guild[]> {
    return this.guildsRepository.find({
      relations: ['owner'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Guild> {
    const guild = await this.guildsRepository.findOne({
      where: { id },
      relations: ['owner', 'channels'],
    });
    if (!guild) throw new NotFoundException(`Servidor con id ${id} no encontrado`);
    return guild;
  }

  async create(nombre: string, descripcion: string, ownerId: number): Promise<Guild> {
    const guild = this.guildsRepository.create({
      nombre,
      descripcion,
      owner: { id: ownerId },
    });
    return this.guildsRepository.save(guild);
  }

  async update(id: number, data: Partial<Guild>, userId: number): Promise<Guild> {
    const guild = await this.findOne(id);
    if (guild.owner.id !== userId) throw new ForbiddenException('Solo el propietario puede editar el servidor');
    await this.guildsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const guild = await this.findOne(id);
    if (guild.owner.id !== userId) throw new ForbiddenException('Solo el propietario puede eliminar el servidor');
    await this.guildsRepository.delete(id);
  }
}
