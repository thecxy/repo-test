FROM cruizba/ubuntu-dind

# 多架构参数（amd64 / arm64）
ARG TARGETARCH

ENV TZ=Asia/Shanghai \
    MAVEN_VERSION=3.8.9 \
    GRADLE_VERSION=7.2 \
    ANT_VERSION=1.10.14 \
    NODE_VERSION=18.19.0 \
    GO_VERSION=1.22.3 \
    HELM_VERSION=3.14.4 \
    DOCKER_TLS_CERTDIR="" \
    Nerdctl_VERSION=1.7.5 \
    DEBIAN_FRONTEND=noninteractive \
    MAMBA_ROOT_PREFIX=/opt/conda \
    DART_VERSION=3.2.0 \
    ZSH=/root/.oh-my-zsh \
    PATH=/opt/conda/bin:/root/.cargo/bin:/root/demo/nuget:/root/package/${TARGETARCH}/dotnet-sdk-10.0.102/:/root/package/${TARGETARCH}/ohpm/bin/:$PATH

# 集中架构判断（仅此一处）
# ARCH_TAG is used by various tools (go, helm, nerdctl, etc.)
# DART_ARCH differs for the amd64 case (Dart archives use x64 instead of amd64)
RUN if [ "$TARGETARCH" = "amd64" ]; then \
        ARCH_TAG="amd64"; \
        DART_ARCH="x64"; \
        CONDA_ARCH="x86_64"; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
        ARCH_TAG="arm64"; \
        DART_ARCH="arm64"; \
        CONDA_ARCH="aarch64"; \
    else \
        echo "❌ Unsupported architecture: $TARGETARCH" && exit 1; \
    fi && \
    echo "ARCH_TAG=$ARCH_TAG" >> /etc/environment && \
    echo "DART_ARCH=$DART_ARCH" >> /etc/environment && \
    echo "CONDA_ARCH=$CONDA_ARCH" >> /etc/environment

SHELL ["/bin/bash", "-c"]

#设置时区
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 基础工具和语言环境（不区分架构，但包含了构建工具和一些常用语言环境，且清理了缓存和不必要的文件以减小镜像体积）
RUN apt-get update && apt-get install -y --no-install-recommends \
    zsh vim jq rsync unzip sudo zip bzip2 cmake build-essential openssl ca-certificates \
    php php-cli php-phar php-mbstring php-xml php-curl php-zip ruby ruby-dev \
    openjdk-17-jdk git-lfs nodejs npm  && \
    git lfs install && \
    rm -rf /var/lib/apt/lists/*

# Maven（不区分架构）
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    | tar -xz -C /opt && ln -s /opt/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/bin/mvn 

# Gradle（不区分架构）
RUN curl -fsSL "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" -o gradle.zip && \
    unzip gradle.zip -d /opt && rm gradle.zip && \
    ln -sf /opt/gradle-${GRADLE_VERSION}/bin/gradle /usr/bin/gradle

# Ant（不区分架构）
RUN curl -fsSL "https://archive.apache.org/dist/ant/binaries/apache-ant-${ANT_VERSION}-bin.tar.gz" \
    | tar -xz -C /opt && \
    ln -s /opt/apache-ant-${ANT_VERSION}/bin/ant /usr/bin/ant

# Go
RUN source /etc/environment && \
    curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-${ARCH_TAG}.tar.gz" \
    | tar -C /usr/local -xzf - && ln -sf /usr/local/go/bin/go /usr/bin/go 

# Helm
RUN source /etc/environment && \
    curl -fsSL "https://get.helm.sh/helm-v${HELM_VERSION}-linux-${ARCH_TAG}.tar.gz" \
    | tar -xz && mv linux-${ARCH_TAG}/helm /usr/bin/helm && rm -rf linux-${ARCH_TAG}

# Python来自Conda(base) (需要twine、build）
# huggingface-hub（不区分架构）
# modelscope（不区分架构）
# conan(依赖cmake、openssl、build-base等系统包，且需要生成配置文件)
RUN source /etc/environment && \
    curl -fsSL "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-${CONDA_ARCH}.sh" -o miniconda.sh && \
    bash miniconda.sh -b -p /opt/conda && \
    rm miniconda.sh && \
    /opt/conda/bin/conda init bash && \
# 激活conda base环境
    . /opt/conda/etc/profile.d/conda.sh && conda activate base && \
    # 安装python构建工具、huggingface-hub、conan、modelscope， 并清理缓存
    pip install --no-cache-dir twine build huggingface-hub==0.26.3 conan==2.23.0 modelscope && \
    conan profile detect --force && \
    conda clean -afy && \
    rm -rf /opt/conda/pkgs

# CocoaPods（不区分架构，但需要安装ruby和相关依赖）
RUN gem install cocoapods --no-document && \
    gem install cocoapods-gitee-repo --no-document && \
    gem cleanup && \
    rm -rf /usr/lib/ruby/gems/*/cache/*.gem && \
    rm -rf /root/.gem

# Nerdctl
RUN source /etc/environment && \
    curl -fL -o nerdctl.tgz \
      https://github.com/containerd/nerdctl/releases/download/v${Nerdctl_VERSION}/nerdctl-${Nerdctl_VERSION}-linux-${ARCH_TAG}.tar.gz && \
    tar -xzf nerdctl.tgz -C /usr/local/bin && \
    rm nerdctl.tgz

# Cargo
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --profile minimal && \
    /root/.cargo/bin/rustup component remove rust-docs || true && \
    rm -rf /root/.cargo/registry && \
    rm -rf /root/.cargo/git

# Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer

# Nuget离线软件包+Ohpm离线软件包+alpine镜像压缩包+centos8镜像压缩包
COPY package/${TARGETARCH}/ /root/package/${TARGETARCH}/

# Dart SDK 安装
RUN source /etc/environment && \
    curl -fsSL "https://storage.googleapis.com/dart-archive/channels/stable/release/${DART_VERSION}/sdk/dartsdk-linux-${DART_ARCH}-release.zip" \
    -o dart.zip && \
    unzip dart.zip -d /usr/local && \
    rm dart.zip && \
    ln -s /usr/local/dart-sdk/bin/dart /usr/bin/dart && \
    ln -s /usr/local/dart-sdk/bin/pub /usr/bin/pub

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
RUN cat > /root/.zshrc << 'EOF'
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