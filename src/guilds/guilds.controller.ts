import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GuildsService } from './guilds.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('guilds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('guilds')
export class GuildsController {
  constructor(private readonly guildsService: GuildsService) {}

  @Get()
  findAll() {
    return this.guildsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guildsService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: { nombre: string; descripcion?: string }, @Request() req) {
    return this.guildsService.create(body.nombre, body.descripcion, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { nombre?: string; descripcion?: string }, @Request() req) {
    return this.guildsService.update(+id, body, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.guildsService.remove(+id, req.user.id);
  }
}
