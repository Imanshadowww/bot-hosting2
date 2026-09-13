#!/bin/bash

echo "[Worker-Process]: Booting daemon core..."
./daemon --tun=userspace-networking --socks5-server=localhost:1055 --statedir=./ --socket=./app.sock &

sleep 5 

echo "[Worker-Process]: Authenticating node to master cluster..."
# آدرس سوکت به قبل از دستور up منتقل شد
./cli --socket=./app.sock up --auth-key="${AUTH_TOKEN}" --hostname=cloud-worker-node --advertise-exit-node &
