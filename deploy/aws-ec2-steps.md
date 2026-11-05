# Despliegue en AWS EC2 con contenedores

Estos son los pasos para desplegar esta API (Node.js + Express + MongoDB) en una instancia EC2 usando Docker y Docker Compose. Sígalos durante la grabación del video para documentar el proceso.

## 1. Crear la instancia EC2

1. Entrar a la consola de AWS -> EC2 -> "Launch instance".
2. Nombre: `taller6-crud`.
3. AMI: **Amazon Linux 2023** (capa gratuita, free tier eligible). También sirve Ubuntu Server 22.04 LTS; ver nota al final de esta sección si se usa esa.
4. Tipo de instancia: `t2.micro` (free tier).
5. Crear o seleccionar un **key pair** (.pem) y descargarlo. Guárdelo en un lugar seguro, no lo suba al repositorio.
6. Grupo de seguridad (Security Group): habilitar los siguientes puertos de entrada (inbound rules):
   - `22` (SSH) - origen: mi IP
   - `3000` (API) - origen: 0.0.0.0/0
7. Lanzar la instancia y esperar a que esté en estado "running".

> **Nota:** el usuario de conexión SSH depende de la AMI elegida: `ec2-user` para Amazon Linux, `ubuntu` para Ubuntu. Revisar "Key pair name" en los detalles de la instancia si da error de `Permission denied (publickey)` al conectar — suele significar que el `.pem` no coincide con el key pair con el que se lanzó la instancia.

## 2. Conectarse por SSH

```bash
chmod 400 taller6-crud.pem
ssh -i taller6-crud.pem ec2-user@<IP_PUBLICA_EC2>
```

Si no conecta, también se puede usar **EC2 Instance Connect** (consola AWS -> EC2 -> Instances -> seleccionar instancia -> botón "Connect" -> pestaña "EC2 Instance Connect"), que abre una terminal SSH en el navegador sin necesidad del `.pem`.

## 3. Instalar Docker y Docker Compose en la instancia

### Amazon Linux 2023 (dnf)

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker

# Permitir ejecutar docker sin sudo
sudo usermod -aG docker ec2-user
newgrp docker

# Docker Compose no viene en los repos de Amazon Linux: se instala el plugin manualmente
mkdir -p ~/.docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

# El paquete "docker" de Amazon Linux trae un buildx viejo/incompleto; "docker compose build"
# exige una versión reciente, así que también se instala el plugin manualmente.
# (se obtiene la versión siguiendo el redirect de "latest" en vez de la API, que puede dar rate limit)
BUILDX_VERSION=$(curl -s -o /dev/null -w '%{redirect_url}' https://github.com/docker/buildx/releases/latest | sed 's#.*/##')
echo "Version detectada: $BUILDX_VERSION"
curl -SL "https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.linux-amd64" -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx

docker --version
docker compose version
docker buildx version
```

> Si al correr `docker compose up -d --build` aparece el error `compose build requires buildx 0.17.0 or later`, es justamente porque falta este paso.

### Ubuntu 22.04 (apt) — alternativa si se usó esta AMI

```bash
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

sudo usermod -aG docker ubuntu
newgrp docker

docker --version
docker compose version
```

## 4. Clonar el repositorio en la instancia

```bash
# Amazon Linux 2023 no siempre trae git preinstalado
sudo dnf install -y git   # omitir en Ubuntu, ya viene instalado

git clone <URL_DEL_REPOSITORIO>
cd <carpeta_del_repositorio>
```

## 5. Levantar los contenedores

```bash
docker compose up -d --build
docker compose ps
```

## 6. Probar la API desde afuera

Desde su máquina local (o el navegador):

```
http://<IP_PUBLICA_EC2>:3000/api/products
```

También se puede probar con `curl` directamente desde la instancia o desde su equipo:

```bash
curl -X POST http://<IP_PUBLICA_EC2>:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Teclado","descripcion":"Mecanico","precio":150000,"stock":10}'
```

## 7. Apagar / limpiar (al terminar la grabación)

```bash
docker compose down
```

Y recuerde **detener o terminar la instancia EC2** desde la consola de AWS para no generar costos.

## Notas para la reflexión del video

- Facilidades: Docker Compose permite levantar la API y su base de datos con un solo comando, tanto en local como en EC2.
- Dificultades típicas: configurar el Security Group (puertos), diferencias de arquitectura (ARM vs x86 si se usa una instancia distinta), tiempo de arranque de las bases de datos antes de que la API pueda conectarse.
- Aprendizajes: la paridad entre el entorno local y la nube se logra usando los mismos Dockerfiles/imagenes en ambos sitios, lo que evita el clásico problema de "en mi máquina sí funciona".
