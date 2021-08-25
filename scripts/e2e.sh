#!/usr/bin/env bash
npx concurrently --kill-others -s first "yarn playground:vue" "cypress run --env playground=vue"
npx concurrently --kill-others -s first "NODE_ENV=test yarn playground:angular" "cypress run --env playground=angular"
npx concurrently --kill-others -s first "NODE_ENV=test yarn playground:react" "cypress run --env playground=react"
npx concurrently --kill-others -s first "NODE_ENV=test yarn playground:javascript" "cypress run --env playground=javascript"
