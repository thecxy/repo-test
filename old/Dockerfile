FROM docker:dind

ENV MAVEN_VERSION=3.8.9 \
    NODE_VERSION=18.19.0 \
    GO_VERSION=1.22.3 \
    HELM_VERSION=3.14.4 \
    DOCKER_TLS_CERTDIR=""


RUN apk add --no-cache \
    bash curl vim openjdk17 \
    python3 py3-pip jq zip

# Maven
RUN curl -fsSL https://dlcdn.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    | tar -xz -C /opt && ln -s /opt/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/bin/mvn

# Node.js + npm
RUN curl -fsSL https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64-musl.tar.xz \
    | tar -xJ -C /usr/local --strip-components=1 && \
    ln -s /usr/local/bin/node /usr/bin/node && \
    ln -s /usr/local/bin/npm /usr/bin/npm && \
    ln -s /usr/local/bin/npx /usr/bin/npx

# Go
RUN curl -fsSL https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz \
    | tar -C /usr/local -xzf - && ln -s /usr/local/go/bin/go /usr/bin/go

# Helm
RUN curl -fsSL https://get.helm.sh/helm-v${HELM_VERSION}-linux-amd64.tar.gz \
    | tar -xz && mv linux-amd64/helm /usr/bin/helm && rm -rf linux-amd64

# Python
RUN ln -sf python3 /usr/bin/python && \
    pip install --break-system-packages twine build

COPY demo/ /root/demo
WORKDIR /root

#设置时区
ENV TZ=Asia/Shanghai
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENTRYPOINT ["dockerd-entrypoint.sh"]
