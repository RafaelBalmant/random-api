#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${BRANCH:-main}"
PM2_ENV="${PM2_ENV:-production}"
LOCK_FILE="${LOCK_FILE:-/tmp/random-api-deploy.lock}"

if [[ -f "$HOME/.bashrc" ]]; then
  # shellcheck disable=SC1090
  source "$HOME/.bashrc"
fi

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Outro deploy já está em andamento."
  exit 0
fi

cd "$APP_DIR"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Repositório com mudanças locais; abortando deploy automático."
  exit 1
fi

git fetch origin "$BRANCH"

LOCAL_HEAD="$(git rev-parse HEAD)"
REMOTE_HEAD="$(git rev-parse "origin/${BRANCH}")"

if [[ "$LOCAL_HEAD" == "$REMOTE_HEAD" ]]; then
  echo "Sem atualizações em origin/${BRANCH}."
  exit 0
fi

echo "Atualizando de $LOCAL_HEAD para $REMOTE_HEAD."
git pull --ff-only origin "$BRANCH"
npm ci --omit=dev

pm2 reload ecosystem.config.cjs --env "$PM2_ENV" --update-env || pm2 start ecosystem.config.cjs --env "$PM2_ENV"
pm2 save

echo "Deploy concluído."
