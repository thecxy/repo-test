#!/usr/bin/env bash

set -e

echo "📦 加载镜像 centos8.tar.gz ..."
docker load -i amd64/centos8/centos8.tar.gz

echo "🚀 启动容器 centos8 (image: centos8:demo) ..."

docker run -dit \
  --name centos8 \
  --restart unless-stopped \
  centos8:demo \
  sleep infinity

echo "✅ 完成"
docker ps | grep centos8