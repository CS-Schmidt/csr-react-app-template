#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx -- commitlint --config ./config/.commitlintrc.yaml --verbose --edit
