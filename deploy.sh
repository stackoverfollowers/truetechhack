docker kill $(docker ps -q)
docker container rm $(docker container ls -aq)
docker image rm --force $(docker images -q)
source .env
docker run -d -p 5432:$POSTGRES_PORT \
    --env-file .env \
    --mount source=postgres_data,target=/var/lib/postgresql/data \
    --restart on-failure:5 \
    --name db \
    --network=my-network \
    --network-alias=db \
    --ip=172.18.0.2 \
    postgres:14
docker run -d -p 6379:$REDIS_PORT \
    --env-file .env \
    --mount source=redis_data,target=/data \
    --restart on-failure:5 \
    --name redis \
    --network=my-network \
    --network-alias=redis \
    --ip=172.18.0.3 \
    redis redis-server --requirepass $REDIS_PASSWORD
docker run -d -p 3001:$BACK_PORT \
--env-file .env \
--mount source=static_data,target=$STATIC_PATH \
--restart on-failure:5 \
--name back \
--network=my-network \
--network-alias=back \
--ip=172.18.0.4 \
andytakker/tth_back:main uvicorn main:app --host 0.0.0.0 --port $BACK_PORT
docker run -d \
    --env-file .env \
    --mount source=static_data,target=$STATIC_PATH \
    --restart on-failure:5 \
    --name celery_worker \
    --network=my-network \
    --network-alias=celery_worker \
    --ip=172.18.0.5 \
    andytakker/tth_back:main celery -A celery_conf worker -Q preprocess_video -E -l INFO -f /logs/celery_worker.log --concurrency 4
docker run -d -p 3000:$FRONT_PORT \
    --env-file .env \
    --restart on-failure:5 \
    --name front \
    --network=my-network \
    --network-alias=front \
    --ip=172.18.0.6 \
    andytakker/tth_front:main
docker run -d -p 80:80 -p 443:443 \
    --env-file .env \
    --restart on-failure:5 \
    --name nginx \
    --network=my-network \
    --network-alias=nginx \
    --ip=172.18.0.7 \
    andytakker/tth_nginx:main
docker exec back alembic upgrade head