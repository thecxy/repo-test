#!/bin/bash

# 设置循环次数
LOOP_COUNT=500


# 循环执行
for ((i=1; i<=LOOP_COUNT; i++))
do
  echo "Starting iteration $i..."

  # 更新版本号
  if ! node updateVersion.js; then
    echo "Error: Failed to update version in iteration $i. Skipping..."
    continue
  fi

  # 发布到 npm
  if ! npm publish; then
    echo "Error: Failed to publish in iteration $i. Skipping..."
    continue
  fi

  # 打印完成信息
  echo "Iteration $i completed. Package published with new version."
  echo "----------------------------------------"

done

echo "All iterations completed."
