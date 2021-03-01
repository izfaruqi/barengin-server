#!/bin/bash

cd /var/app/current/;

. ~/.nvm/nvm.sh;

nvm install 14 --lts;

npm ci;
