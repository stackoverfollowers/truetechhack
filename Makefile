VENV_PATH = ./.venv/
BACK_SRC_PATH = ./back/src

init_venv:
	@rm -rf $(VENV_PATH)
	@python3 -m venv $(VENV_PATH)
	@$(VENV_PATH)/bin/pip install -U pip
	@$(VENV_PATH)/bin/pip install -r ./back/requirements.txt
	@cp .env.example .env
	echo "Venv was initialized!"

build_dev:
	@docker kill $(docker ps -q) &>/dev/null
	@docker compose -f docker-compose.dev.yaml build --no-cache --parallel

build_prod:
	@docker kill $(docker ps -q) $>/dev/null
	@docker compose build --no-cache --parallel

up_dev:
	@docker compose -f docker-compose.dev.yaml up -d

up_prod:
	@docker compose up -d

dev_celery_log:
	@docker-compose -f docker-compose.dev.yaml exec celery_worker tail -f /logs/celery_worker.log

prod_celery_log:
	@docker-compose exec celery_worker tail -f /logs/celery_worker.log

pre_commit:
	@$(VENV_PATH)/bin/black $(BACK_SRC_PATH)
	@$(VENV_PATH)/bin/isort $(BACK_SRC_PATH)