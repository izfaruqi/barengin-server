#!/bin/bash

cd /var/app/current/;

if [[ -f ".env" ]];then
  echo "File env exist. Replacing with a new one";
  rm .env;
else
  echo "File env does not exist. Creating env file";
fi;

echo "PORT=8080" > .env;
echo "HOSTNAME=127.0.0.1" >> .env;

echo "JWT_SECRET=$(echo 'ThisIsASecretKey' | base64)" >> .env;

echo "DB_HOST=10.0.2.142" >> .env;
echo "DB_PORT=3306" >> .env;
echo "DB_NAME=intern_12" >> .env;
echo "DB_USER=intern_12" >> .env;
echo "DB_PASS=" >> .env;

echo "GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json" >> .env;
