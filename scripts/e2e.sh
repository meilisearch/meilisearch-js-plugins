#!/usr/bin/env bash
npx concurrently --kill-others -s first "yarn playground:vue" "cypress run --spec 'cypress/integration/search-ui.js'\" --env playground=vue"
npx concurrently --kill-others -s first "NODE_ENV=test yarn playground:angular" "cypress run --spec 'cypress/integration/search-ui.js'\" --env playground=angular"
npx concurrently --kill-others -s first "NODE_ENV=test yarn playground:react" "cypress run --spec 'cypress/integration/search-ui.js'\" --env playground=react"
npx concurrently --kill-others -s first "NODE_ENV=test yarn playground:javascript" "cypress run --spec 'cypress/integration/search-ui.js'\" --env playground=javascript"
yarn local:env:setup && npx concurrently --kill-others -s first \"yarn local:env:react\" \"cypress run --spec 'cypress/integration/local-ui.js'\""
