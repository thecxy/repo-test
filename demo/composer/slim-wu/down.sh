#!/bin/bash

# 最大重试次数
MAX_RETRIES=5
# 最大循环次数
MAX_ITERATIONS=100

# 成功计数器
success_count=0
# 循环次数计数器
iteration_count=0
# 重试次数计数器
retry_count=0

# 循环执行整个过程，直到达到最大循环次数
while [ $iteration_count -lt $MAX_ITERATIONS ]; do
  # 删除 vendor 目录中的所有文件
  echo "Deleting vendor files..."
  rm -rf ./vendor/*

  # 运行 composer 清理缓存，并自动输入 yes
  echo "Clearing composer cache..."
  yes | php composer_v2.phar cc
  if [ $? -ne 0 ]; then
    echo "Failed to clear cache. Retrying..."
    retry_count=$((retry_count + 1))
    if [ $retry_count -ge $MAX_RETRIES ]; then
      echo "Exceeded maximum retry count ($MAX_RETRIES) for cache clearing. Skipping..."
      retry_count=0  # 重置重试计数器
    fi
    sleep 3
    continue
  fi

  # 执行 composer install 安装依赖，并自动输入 yes
  echo "Running composer install..."
  yes | php composer_v2.phar install --prefer-dist
  if [ $? -eq 0 ]; then
    echo "Composer install completed successfully."
    success_count=$((success_count + 1))
  else
    echo "Composer install failed. Retrying..."
    retry_count=$((retry_count + 1))
    if [ $retry_count -ge $MAX_RETRIES ]; then
      echo "Exceeded maximum retry count ($MAX_RETRIES) for install. Skipping..."
      retry_count=0  # 重置重试计数器
    fi
    sleep 3  # 等待 3 秒后重试
  fi

  # 增加循环次数
  iteration_count=$((iteration_count + 1))
  echo "Completed iteration $iteration_count of $MAX_ITERATIONS"
done

# 输出成功的次数
echo "Total successful iterations: $success_count"

