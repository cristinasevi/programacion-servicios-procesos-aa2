import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}

  findAll(): Promise<Channel[]> {
    return this.channelsRepository.find({
      relations: ['guild'],
      order: { id: 'ASC' },
    });
  }

  findByGuild(guildId: number): Promise<Channel[]> {
    return this.channelsRepository.find({
      where: { guild: { id: guildId } },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { id },
      relations: ['guild', 'guild.owner'],
    });
    if (!channel) throw new NotFoundException(`Canal con id ${id} no encontrado`);
    return channel;
  }

  async create(nombre: string, tipo: string, guildId: number): Promise<Channel> {
    const channel = this.channelsRepository.create({
      nombre,
      tipo: tipo ?? 'text',
      guild: { id: guildId },
    });
    return this.channelsRepository.save(channel);
  }

  async update(id: number, data: Partial<Channel>, userId: number): Promise<Channel> {
    const channel = await this.findOne(id);
    if (channel.guild.owner.id !== userId) throw new ForbiddenException('Solo el propietario puede editar canales');
    await this.channelsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const channel = await this.findOne(id);
    if (channel.guild.owner.id !== userId) throw new ForbiddenException('Solo el propietario puede eliminar canales');
    await this.channelsRepository.delete(id);
  }
}
