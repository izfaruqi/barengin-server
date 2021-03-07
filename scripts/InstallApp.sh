#!/bin/bash

cd /var/app/current/;

. ~/.nvm/nvm.sh;

aws s3 cp s3://intern-config-bcc-filkom-ub/serviceAccountKey.json ./
aws s3 cp s3://intern-config-bcc-filkom-ub/firebaseConfig.json ./

nvm install 14 --lts;

npm ci;
