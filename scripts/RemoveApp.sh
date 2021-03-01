#!/bin/bash

. ~/.nvm/nvm.sh;

pm2 delete all;

rm -rf /var/app/current;
