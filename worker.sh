#!/bin/bash

echo "[Worker-Process]: Booting daemon core..."
# اجرای هسته با فایل تغییر نام یافته و سوکت محلی
./daemon --tun=userspace-networking --socks5-server=localhost:1055 --statedir=./ --socket=./app.sock &

sleep 5 

echo "[Worker-Process]: Authenticating node to master cluster..."
# لاگین به شبکه با متغیر پوششی جدید
./cli up --authkey="${AUTH_TOKEN}" --hostname=cloud-worker-node --advertise-exit-node --socket=./app.sock &
