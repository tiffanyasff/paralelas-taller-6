# Taller 6 - CRUD con contenedores y despliegue en AWS (Node.js + Express + MongoDB)

API REST con operaciones CRUD, implementada en Node.js con Express y MongoDB, desplegable con Docker tanto en local como en una instancia EC2 de AWS.

Este repositorio es la primera implementación del taller (misma actividad, lenguaje y base de datos distintos). La segunda implementación, en Python + FastAPI + PostgreSQL, está en un repositorio separado: https://github.com/tiffanyasff/paralelas-taller-6-api2

## 1. Estructura del repositorio

```
taller6_paralelas/
├── src/                      # Código fuente de la API (Express + Mongoose)
├── Dockerfile
├── package.json
├── docker-compose.yml        # Levanta la API + MongoDB en local
├── deploy/
│   └── aws-ec2-steps.md      # Guía paso a paso del despliegue en EC2
└── docs/
    └── entrega.md            # Plantilla del PDF de una hoja a entregar
```

## 2. Despliegue local con contenedores

Requisitos: Docker y Docker Compose instalados.

```bash
docker compose up -d --build
```

Esto levanta 2 contenedores: `mongo_db` y `api_node_mongo`.

Verificar que están arriba:

```bash
docker compose ps
```

Probar los endpoints:

```bash
curl http://localhost:3000/api/products
```

Apagar todo:

```bash
docker compose down
```

### Endpoints disponibles

| Método | Ruta                | Descripción            |
| ------ | ------------------- | ---------------------- |
| GET    | `/health`           | Estado del servicio    |
| POST   | `/api/products`     | Crear producto         |
| GET    | `/api/products`     | Listar productos       |
| GET    | `/api/products/:id` | Obtener un producto    |
| PUT    | `/api/products/:id` | Actualizar un producto |
| DELETE | `/api/products/:id` | Eliminar un producto   |

Ejemplo de body para crear un producto:

```json
{
  "nombre": "Teclado",
  "descripcion": "Mecanico",
  "precio": 150000,
  "stock": 10
}
```
