# Taller 6 - CRUD con contenedores y despliegue en AWS (Node.js + Express + MongoDB)

API REST con operaciones CRUD, implementada en Node.js con Express y MongoDB, desplegable con Docker tanto en local como en una instancia EC2 de AWS.

Este repositorio es la primera implementación del taller (misma actividad, lenguaje y base de datos distintos). La segunda implementación, en Python + FastAPI + PostgreSQL, está en un repositorio separado: [URL_DEL_REPOSITORIO_PYTHON_POSTGRES].

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

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servicio |
| POST | `/api/products` | Crear producto |
| GET | `/api/products` | Listar productos |
| GET | `/api/products/:id` | Obtener un producto |
| PUT | `/api/products/:id` | Actualizar un producto |
| DELETE | `/api/products/:id` | Eliminar un producto |

Ejemplo de body para crear un producto:

```json
{
  "nombre": "Teclado",
  "descripcion": "Mecanico",
  "precio": 150000,
  "stock": 10
}
```

## 3. Despliegue en AWS EC2

Ver la guía detallada en [`deploy/aws-ec2-steps.md`](deploy/aws-ec2-steps.md): creación de la instancia, security group, instalación de Docker, clonado del repo y `docker compose up -d --build` en la nube.

## 4. Grabación del video (guion sugerido)

El video debe mostrar el paso a paso de **ambos** repositorios (esta API y la de Python+Postgres) y terminar con una reflexión. Estructura sugerida (10-15 min):

1. **Introducción (1 min):** nombre, objetivo del taller, los dos stacks elegidos.
2. **Código y arquitectura (2-3 min):** mostrar brevemente las dos APIs (estructura de carpetas, modelo CRUD, Dockerfile) en sus respectivos repositorios.
3. **Despliegue local (3-4 min):** `docker compose up -d --build` en cada repositorio, mostrar los contenedores con `docker ps`, probar los endpoints con `curl` o Postman en las dos APIs.
4. **Despliegue en AWS EC2 (4-5 min):** crear las instancias, configurar el security group, conectarse por SSH, instalar Docker, clonar cada repo, `docker compose up -d --build`, probar los endpoints desde el navegador usando la IP pública.
5. **Reflexión final (2-3 min):**
   - **Facilidades:** ¿qué fue fácil gracias a los contenedores? (paridad local/nube, un solo comando para levantar todo).
   - **Dificultades:** ¿qué problemas aparecieron? (permisos de Docker, configuración de puertos/security group, tiempos de arranque de la base de datos, diferencias entre los dos lenguajes/bases de datos).
   - **Aprendizajes:** ¿qué le quedó claro sobre contenedores, despliegue en la nube y trabajar con dos stacks distintos?
6. **Cierre (30 seg):** apagar los contenedores (`docker compose down`) y recordar detener las instancias EC2.

Subir el video a YouTube (público o no listado) y copiar el enlace en el PDF de entrega.

## 5. Entrega

Ver [`docs/entrega.md`](docs/entrega.md) para la plantilla del PDF de una hoja que se debe subir, con: datos del estudiante, enlaces de ambos repositorios y enlace del video.
