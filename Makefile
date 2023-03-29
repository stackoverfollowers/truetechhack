VENV_PATH = ./.venv/

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

up_dev:
	@docker compose -f docker-compose.dev.yaml up -d

celery_log:
	@docker-compose -f docker-compose.dev.yaml exec celery_worker tail -f /logs/celery_worker.log

pre_commit:
	@$(VENV_PATH)/bin/black ./back/src
	@$(VENV_PATH)/bin/isort ./back/src