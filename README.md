# Discord API — PSP 2ª Evaluación

Backend tipo Discord con NestJS + TypeORM + PostgreSQL.

## Arrancar

```bash
docker compose up --build
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Endpoints

### Auth (público)
| Método | Ruta | Body |
|--------|------|------|
| POST | `/auth/register` | `{ username, email, password }` |
| POST | `/auth/login` | `{ email, password }` → devuelve `access_token` |

### Users, Guilds, Channels (requieren JWT)
Añadir header: `Authorization: Bearer <token>`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listar usuarios |
| GET / PATCH / DELETE | `/users/:id` | Ver / editar / borrar |
| GET | `/guilds` | Listar servidores |
| POST | `/guilds` | Crear servidor `{ nombre, descripcion? }` |
| GET / PATCH / DELETE | `/guilds/:id` | Ver / editar / borrar (solo owner) |
| GET | `/channels?guildId=1` | Canales de un servidor |
| POST | `/channels` | Crear canal `{ nombre, guildId, tipo? }` |
| PATCH / DELETE | `/channels/:id` | Editar / borrar (solo owner del servidor) |
