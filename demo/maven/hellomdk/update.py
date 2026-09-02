#!/usr/bin/env python3

import re
import random

# 读取 pom.xml 文件
with open('pom.xml', 'r') as file:
    content = file.read()

# 生成随机版本号（x.y-SNAPSHOT 或 x.y.z）
def generate_random_version():
    x = random.randint(1, 10)  # x 范围：1-10
    y = random.randint(0, 9)   # y 范围：0-9
    if random.choice([True, False]):  # 随机选择格式
        # 生成 x.y.z 格式
        z = random.randint(0, 9)  # z 范围：0-9
        return f"{x}.{y}.{z}"
    else:
        # 生成 x.y-SNAPSHOT 格式
        return f"{x}.{y}-SNAPSHOT"

# 替换项目的顶级版本号（不匹配依赖项的版本号）
def replace_project_version(content):
    # 使用正则表达式匹配项目的顶级版本号
    # 匹配 <project> 标签下的 <version>x.y.z</version> 或 <version>x.y-SNAPSHOT</version>
    # 确保不匹配 <dependencies> 内的版本号
    content = re.sub(
        r'(<project[^>]*>\s*.*?<version>)(\d+\.\d+(\.\d+)?(-SNAPSHOT)?)(</version>)',
        lambda match: f"{match.group(1)}{generate_random_version()}{match.group(5)}",
        content,
        count=1,  # 只替换第一个匹配项
        flags=re.DOTALL  # 允许跨行匹配
    )
    return content

# 替换内容
content = replace_project_version(content)

# 打印替换后的内容（调试用）
print("Updated content:")
print(content)

# 写回 pom.xml 文件
with open('pom.xml', 'w') as file:
    file.write(content)

print("Project version updated successfully!")
