# truetechhack

DEMO: [http://91.185.84.129/](http://91.185.84.129/)

Stack: Python 3.10, FastAPI, Next.js, Nginx, PostgreSQL, Redis, Celery SkLearn

## Run project

### Dev run

In dev version Docker Compose uses `Dockerfile.dev` for buildings and
maps `./back/src` as volume for autoreloading and postgres container hasn't volume.

```bash
cp .env.example .env
docker-compose -f docker-compose.dev.yaml up --build -d
```


### Production run

```bash
cp .env.example .env
docker-compose up --build -d
```

### Migrations

Using alembic for automate create migrations

```shell
alembic revision --autogenerate -m "Name of migration"
```

```shell
docker-compose exec backend alembic revision --autogenerate -m "Name of migration"
```

For apply 

```shell
alembic upgrade head
```

or 

```shell
docker-compose exec backend alembic upgrade head
```

### Scrinshots

![1](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/1.jpg)
![2](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/2.jpg)
![3](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/3.jpg)
![4](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/4.jpg)
![5](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/5.jpg)
![6](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/6.jpg)
![7](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/7.jpg)
![8](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/8.jpg)
![91](https://github.com/stackoverfollowers/truetechhack/raw/main/docs/9.jpg)
