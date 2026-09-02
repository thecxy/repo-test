#!/bin/bash

# 设置循环次数
LOOP_COUNT=1000

# 日志文件
LOG_FILE="deploy.log"

# 清空日志文件
> "$LOG_FILE"

# 循环执行
for ((i=1; i<=LOOP_COUNT; i++))
do
  echo "Starting iteration $i..."
  echo "Starting iteration $i..." >> "$LOG_FILE"

  # 更新版本号
  echo "Updating version..."
  python3 update.py >> "$LOG_FILE" 2>&1

  # 检查 pom.xml 文件格式
  echo "Validating pom.xml format..."
  xmllint --format pom.xml --output pom.xml

  # 构建项目
  echo "Building project..."
  if ! mvn clean install >> "$LOG_FILE" 2>&1; then
    echo "Build failed. Check $LOG_FILE for details."
    exit 1
  fi

  # 发布到 Maven 仓库
  echo "Deploying to Maven repository..."
  if ! mvn deploy -s settings.xml >> "$LOG_FILE" 2>&1; then
    echo "Deploy failed. Check $LOG_FILE for details."
    exit 1
  fi

  # 打印完成信息
  echo "Iteration $i completed. Package published with new SNAPSHOT version."
  echo "Iteration $i completed. Package published with new SNAPSHOT version." >> "$LOG_FILE"
  echo "----------------------------------------"
  echo "----------------------------------------" >> "$LOG_FILE"
done

echo "All iterations completed."
echo "All iterations completed." >> "$LOG_FILE"
