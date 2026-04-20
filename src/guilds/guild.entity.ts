import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';

@Entity('guilds')
export class Guild {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @CreateDateColumn()
  creadoEn: Date;

  @ManyToOne(() => User, user => user.guilds, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Channel, channel => channel.guild, { eager: false })
  channels: Channel[];
}
