# syntax=docker/dockerfile:1

FROM cruizba/ubuntu-dind

# 多架构参数（amd64 / arm64）
ARG TARGETARCH

ENV TZ=Asia/Shanghai \
    MAVEN_VERSION=3.8.9 \
    GRADLE_VERSION=7.2 \
    NODE_VERSION=18.19.0 \
    GO_VERSION=1.22.3 \
    HELM_VERSION=3.14.4 \
    DOCKER_TLS_CERTDIR="" \
    Nerdctl_VERSION=1.7.5 \
    DEBIAN_FRONTEND=noninteractive \
    PIP_BREAK_SYSTEM_PACKAGES=1 \
    ZSH=/root/.oh-my-zsh \
    PATH="/opt/venv/bin:$PATH"

# 集中架构判断（仅此一处）
# ARCH_TAG is used by various tools (go, helm, nerdctl, etc.)
# DART_ARCH differs for the amd64 case (Dart archives use x64 instead of amd64)
RUN if [ "$TARGETARCH" = "amd64" ]; then \
        ARCH_TAG="amd64"; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
        ARCH_TAG="arm64"; \
    else \
        echo "❌ Unsupported architecture: $TARGETARCH" && exit 1; \
    fi && \
    echo "ARCH_TAG=$ARCH_TAG" >> /etc/environment  

SHELL ["/bin/bash", "-c"]

#设置时区
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 基础工具和语言环境（不区分架构，但包含了构建工具和一些常用语言环境，且清理了缓存和不必要的文件以减小镜像体积）
RUN apt-get update && apt-get install -y --no-install-recommends \
    zsh vim jq unzip zip   \
    openjdk-17-jdk  nodejs npm python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/* && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    ln -sf /usr/bin/pip3 /usr/bin/pip && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip &&\
    /opt/venv/bin/pip install --no-cache-dir twine build

# Maven（不区分架构）
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    | tar -xz -C /opt && ln -s /opt/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/bin/mvn 

# Gradle（不区分架构）
RUN curl -fsSL "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" -o gradle.zip && \
    unzip gradle.zip -d /opt && rm gradle.zip && \
    ln -sf /opt/gradle-${GRADLE_VERSION}/bin/gradle /usr/bin/gradle

# Go
RUN source /etc/environment && \
    curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-${ARCH_TAG}.tar.gz" \
    | tar -C /usr/local -xzf - && ln -sf /usr/local/go/bin/go /usr/bin/go 

# Helm
RUN source /etc/environment && \
    curl -fsSL "https://get.helm.sh/helm-v${HELM_VERSION}-linux-${ARCH_TAG}.tar.gz" \
    | tar -xz && mv linux-${ARCH_TAG}/helm /usr/bin/helm && rm -rf linux-${ARCH_TAG}

# 项目文件
COPY demo/ /root/demo

# 优化使用
# 1. 安装 Oh My Zsh（非交互）
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# 2. 安装第三方插件
RUN git clone https://github.com/zsh-users/zsh-completions \
        ${ZSH}/custom/plugins/zsh-completions \
 && git clone https://github.com/zsh-users/zsh-autosuggestions \
        ${ZSH}/custom/plugins/zsh-autosuggestions \
 && git clone https://github.com/zsh-users/zsh-syntax-highlighting \
        ${ZSH}/custom/plugins/zsh-syntax-highlighting

# ===============================
# 3. 固化最终 .zshrc
# ===============================
RUN cat > /root/.zshrc <<'EOF'
export ZSH="$HOME/.oh-my-zsh"

# 设置本地化环境 / 语言环境
export LANG=C.UTF-8

# 让 zsh 能找到补全
fpath+=${ZSH}/custom/plugins/zsh-completions/src

plugins=(
  extract
  zsh-completions
  zsh-autosuggestions
  zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh
EOF

# ===============================
# 4. 安装 starship
# ===============================
RUN curl -fsSL https://starship.rs/install.sh | sh -s -- -y \
 && echo 'eval "$(starship init zsh)"' >> /root/.zshrc

WORKDIR /root

# ENTRYPOINT ["entrypoint.sh"]