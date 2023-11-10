## Getting Started

Additionally, you need to create a .env file in the root folder:
```env
REDIS_HOST="..."
REDIS_PASSWORD="..."
REDIS_PORT="..."

SENDER_EMAIL="..."
SENDER_PASSWORD="..."

FTP_USER="..."
FTP_PASSWORD="..."
FTP_HOST="..."

REDIS_URL="..."
REDIS_TOKEN="..."
```

### 1. To start, you need to pull Docker
  ```bash
  docker pull mazilas2/otrpoapp:flask
  ```
### 2. Then start server by command:
  ```bash
  docker run --env-file .env --rm -it -p 3000:3000/tcp otrpoapp:flask
  ```
