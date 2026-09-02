#!/usr/bin/env bash

set -e

echo "📦 加载镜像 alpine.tar.gz ..."
docker load -i amd64/alpine/alpine.tar.gz

echo "🚀 启动容器 alpine (image: alpine:demo) ..."

docker run -dit \
  --name alpine \
  --restart unless-stopped \
  alpine:demo \
  sleep infinity

echo "✅ 完成"
docker ps | grep alpine