#!/bin/bash

# ================= 参数说明 =================
# $1 - 仓库基础URL (格式: 192.168.1.100:31068)
# $2 - 用户名 (默认 admin)
# $3 - 密码 (默认 admin@2023)
# $4 - 仓库名称 (默认 0702-maven-vr)
# ===========================================

BASE_URL="${1:-${REPO_URL}}"
USERNAME="${2:-${REPO_USER:-admin}}"
PASSWORD="${3:-${REPO_PASS:-admin@2023}}"
REPO_NAME="${4:-${REPO_NAME:-0702-maven-vr}}"
LOCAL_REPO_DIR="./maven/hellomdk/repository-offine"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_file_exists() {
    local file="$1"
    [ -f "$file" ] || { echo -e "${RED}未找到 ${file}，跳过${NC}"; return 1; }
}

backup_file() {
    cp -f "$1" "$1.bak"
}

validate_environment() {
    if [ -z "$BASE_URL" ]; then
        echo -e "${RED}错误：必须提供仓库URL${NC}"
        exit 1
    fi

    if [[ ! $BASE_URL =~ ^([a-zA-Z0-9.-]+):[0-9]{1,5}$ ]]; then
        echo -e "${RED}错误：URL格式不正确，应为 HOST:PORT 格式${NC}"
        exit 1
    fi

    if [ ! -d "$LOCAL_REPO_DIR" ]; then
        echo -e "${RED}错误：目录 ${LOCAL_REPO_DIR} 不存在${NC}"
        exit 1
    fi
}

upload_files() {
    echo -e "${YELLOW}=== 开始上传文件 ===${NC}"
    find "$LOCAL_REPO_DIR" -type f \
        -not -name 'mavenimport.sh' \
        -not -name '*.sh' \
        -not -path '*/.*' \
        -not -name 'archetype-catalog.xml' \
        -not -name 'maven-metadata-local*.xml' \
        -not -name 'maven-metadata-deployment*.xml' \
        | sed "s|^${LOCAL_REPO_DIR}/||" \
        | while read -r file; do
            local_path="${LOCAL_REPO_DIR}/${file}"
            echo -e "${GREEN}上传中：${file}${NC}"
            curl --progress-bar --fail \
                -u "${USERNAME}:${PASSWORD}" \
                --create-dirs \
                -X PUT -T "${local_path}" \
                --header 'User-Agent: Apache-Maven/3.6.3 (Java 11.0.16.1)' \
                "http://${BASE_URL}/repo/repository/${REPO_NAME}/${file}" \
                && echo -e "${GREEN}✔ 上传成功${NC}\n" \
                || echo -e "${RED}✘ 上传失败${NC}\n"
        done
}


update_settings_xml() {
    echo -e "${YELLOW}=== 修改 settings.xml ===${NC}"
    SETTINGS_FILE="./maven/hellomdk/settings.xml"
    check_file_exists "$SETTINGS_FILE" || return 0
    backup_file "$SETTINGS_FILE"

    NEW_URL="http://${BASE_URL}/repo/repository/${REPO_NAME}"
    sed -i "s|<password>[^<]*</password>|<password>${PASSWORD}</password>|g" "$SETTINGS_FILE"
    sed -i "s|http://[^<\"]*/repo/repository/[^<\"]*|${NEW_URL}|g" "$SETTINGS_FILE"
    echo -e "${GREEN}settings.xml 修改完成${NC}"
}

update_pom_xml() {
    echo -e "${YELLOW}=== 修改 pom.xml ===${NC}"
    POM_FILE="./maven/hellomdk/pom.xml"
    check_file_exists "$POM_FILE" || return 0
    backup_file "$POM_FILE"

    NEW_URL="http://${BASE_URL}/repo/repository/${REPO_NAME}"
    sed -i "s|<url>http://[^<]*</url>|<url>${NEW_URL}</url>|g" "$POM_FILE"

    sed -i "0,/<artifactId>[^<]*<\/artifactId>/s//<artifactId>test<\/artifactId>/" "$POM_FILE"
    sed -i "0,/<version>[^<]*<\/version>/s//<version>3.8.4<\/version>/" "$POM_FILE"
    sed -i "0,/<packaging>[^<]*<\/packaging>/s//<packaging>jar<\/packaging>/" "$POM_FILE"
    sed -i "0,/<name>[^<]*<\/name>/s//<name>hellomdk<\/name>/" "$POM_FILE"

    echo -e "${GREEN}pom.xml 修改完成${NC}"
}

run_mvn_deploy() {
    echo -e "${YELLOW}=== 执行 mvn deploy ===${NC}"
    check_file_exists "./maven/hellomdk/settings.xml" || return 1
    mvn deploy -s settings.xml && echo -e "${GREEN}部署成功${NC}" || echo -e "${RED}部署失败${NC}"
}

update_pom_dependencies() {
    echo -e "${YELLOW}=== 修改 pom.xml 依赖和基础信息 ===${NC}"
    POM_FILE="./maven/hellomdk/pom.xml"
    check_file_exists "$POM_FILE" || return 0

    # ======= 精确检查是否已存在 com.gitee.mdk:test 依赖 =======
    if awk '
    BEGIN { found = 0; in_dep = 0; dep = "" }
    /<dependency>/ { in_dep = 1; dep = $0; next }
    /<\/dependency>/ {
        dep = dep $0
        if (dep ~ /<groupId>com\.gitee\.mdk<\/groupId>/ && dep ~ /<artifactId>test<\/artifactId>/) {
            found = 1
            exit
        }
        in_dep = 0
        dep = ""
        next
    }
    {
        if (in_dep) dep = dep $0
    }
    END { exit !found }
    ' "$POM_FILE"; then
        echo -e "${GREEN}依赖 com.gitee.mdk:test 已存在，跳过新增${NC}"
    else
        # 如果没有 <dependencies> 标签，添加空标签
        if ! grep -q "<dependencies>" "$POM_FILE"; then
            sed -i "0,/<project>/s|<project>|<project>\n  <dependencies>\n  </dependencies>|" "$POM_FILE"
        fi

        # 在 </dependencies> 前插入新的依赖
        sed -i "/<\/dependencies>/i \
    <dependency>\n\
      <groupId>com.gitee.mdk</groupId>\n\
      <artifactId>test</artifactId>\n\
      <version>3.8.4</version>\n\
    </dependency>" "$POM_FILE"

        echo -e "${GREEN}新增依赖 com.gitee.mdk:test${NC}"
    fi

    # ======= 修改项目名称和版本 =======
    sed -i "0,/<artifactId>[^<]*<\/artifactId>/s//<artifactId>test111<\/artifactId>/" "$POM_FILE"
    sed -i "0,/<version>[^<]*<\/version>/s//<version>3.8.5<\/version>/" "$POM_FILE"
    sed -i "0,/<packaging>[^<]*<\/packaging>/s//<packaging>jar<\/packaging>/" "$POM_FILE"
    sed -i "0,/<name>[^<]*<\/name>/s//<name>hellomdk111<\/name>/" "$POM_FILE"

    echo -e "${GREEN}pom.xml 依赖及基础信息修改完成${NC}"
}

run_mvn_install() {
    echo -e "${YELLOW}=== 执行 mvn install ===${NC}"
    check_file_exists "./maven/hellomdk/settings.xml" || return 1
    echo "清理本地缓存 com.gitee 目录..."
    rm -rf ~/.m2/repository/com/gitee
    mvn install -s settings.xml && echo -e "${GREEN}安装成功${NC}" || echo -e "${RED}安装失败${NC}"
}

rollback_pom_dependencies(){
	echo -e "${YELLOW}=== 恢复 pom.xml 依赖和基础信息 ===${NC}"
	
	sed -i '/<dependency>/,/<\/dependency>/d' "$POM_FILE"
    POM_FILE="./maven/hellomdk/pom.xml"
    check_file_exists "$POM_FILE" || return 0

    if grep -q "<groupId>junit</groupId>" "$POM_FILE" && grep -q "<artifactId>junit</artifactId>" "$POM_FILE"; then
        echo -e "${GREEN}依赖 junit:junit 已存在，跳过新增${NC}"
    else
        if ! grep -q "<dependencies>" "$POM_FILE"; then
            sed -i "0,/<project>/s|<project>|<project>\n  <dependencies>\n  </dependencies>|" "$POM_FILE"
        fi

        sed -i "/<\/dependencies>/i \
    <dependency>\n\
      <groupId>junit</groupId>\n\
      <artifactId>junit</artifactId>\n\
      <version>3.8.1</version>\n\
	  <scope>test</scope>\n\
    </dependency>" "$POM_FILE"

    fi

}



main() {
    echo -e "\n${GREEN}=========== Maven 工具脚本 ==========="
    echo " 仓库地址 : http://${BASE_URL}/repo/repository/${REPO_NAME}"
    echo " 用户名   : ${USERNAME}"
    echo " 本地目录 : ${LOCAL_REPO_DIR}"
    echo -e "======================================${NC}"

    validate_environment
    #upload_files
    update_settings_xml
    update_pom_xml
    run_mvn_deploy
    update_pom_dependencies
    run_mvn_install
    #rollback_pom_dependencies
}

main
