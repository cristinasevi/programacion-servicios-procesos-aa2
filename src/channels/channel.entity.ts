import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Guild } from '../guilds/guild.entity';

@Entity('channels')
export class Channel {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: 'text' })
  tipo: string;

  @CreateDateColumn()
  creadoEn: Date;

  @ManyToOne(() => Guild, guild => guild.channels, { onDelete: 'CASCADE' })
  guild: Guild;
}
