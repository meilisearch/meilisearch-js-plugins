#!/usr/bin/env bash
yarn start-server playground:react http://localhost:1111 'cypress run --env playground=react'
yarn start-server playground:angular http://localhost:4200 'cypress run --env playground=angular'
yarn start-server playground:vue http://localhost:8080 'cypress run --env playground=vue'
yarn start-server playground:javascript http://localhost:2222 'cypress run --env playground=javascript'
