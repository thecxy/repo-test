# Maven AutoTest 工具脚本

本项目包含一个用于将本地 Maven 仓库内容或项目部署到远程 Maven 仓库的 Bash 脚本：`maven_autotest.sh`。该脚本适用于Repo私有 Maven 仓库。

---

## 🧩 功能介绍

该脚本包含以下步骤：

1. ✅ 校验参数与目录结构
2. 🛠 自动修改 `settings.xml` 仓库配置
3. 🔧 自动修改 `pom.xml` 中的基本信息（artifactId、version、name等）
4. 🚀 执行 `mvn deploy` 进行部署
5. ➕ 添加测试依赖 `com.gitee.mdk:test`
6. 🔄 执行 `mvn install` 验证依赖安装成功
7. （可选）🧼 恢复/替换 `pom.xml` 的依赖（如 junit）

---

## 🚀 使用方法

### 📦 运行脚本

```bash
chmod +x maven_autotest.sh
./maven_upload.sh <仓库地址:端口> [用户名] [密码] [仓库名称]

