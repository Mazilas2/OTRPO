## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

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

To re-create db file:
## 1 Step
Delete old pokemons.db file
## 2 Step 
Run create_db
```bash
python ./api/create_db.py
```
