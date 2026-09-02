#!/bin/sh

echo "=========================================="
echo "      Protocol Environment Verify"
echo "=========================================="

has_cmd() { command -v "$1" >/dev/null 2>&1; }

# ---------- OS ----------
if [ -f /etc/alpine-release ]; then
    echo "[OS Base] ✅ Alpine Linux $(cat /etc/alpine-release) (musl)"
elif [ -f /etc/debian_version ]; then
    echo "[OS Base] ✅ Debian/Ubuntu $(cat /etc/debian_version)"
else
    echo "[OS Base] ⚠️ Unknown Linux"
fi

# ---------- Generic ----------
has_cmd curl && echo "[Generic] ✅ curl $(curl --version | head -n1 | awk '{print $2}')" || echo "[Generic] ❌ curl"
has_cmd apt-get && echo "[Apt] ✅ Installed" || echo "[Apt] ❌ Not Installed"
has_cmd rpm && echo "[RPM] ✅ Installed" || echo "[RPM] ❌ Not Installed"

# ---------- Git ----------
if has_cmd git; then
    GIT_VER=$(git --version | awk '{print $3}')
    has_cmd git-lfs && echo "[Git] ✅ ${GIT_VER} (with git-lfs)" || echo "[Git] ✅ ${GIT_VER}"
else
    echo "[Git] ❌ Not Installed"
fi

# ---------- Java ----------
if has_cmd java; then
    echo "[Java Base] ✅ $(java -version 2>&1 | awk -F '"' '/version/ {print $2}')"
    has_cmd mvn && echo " ├─ [Maven] ✅ $(mvn -v | head -n1 | awk '{print $3}')" || echo " ├─ [Maven] ❌ Not Installed"
    has_cmd gradle && echo " └─ [Gradle] ✅ $(gradle -v 2>/dev/null | awk '/^Gradle /{print $2}')" || echo " └─ [Gradle] ❌ Not Installed"
else
    echo "[Java Base] ❌ Not Found"
fi

# ---------- Node ----------
has_cmd node && has_cmd npm \
  && echo "[Node & Npm] ✅ $(node -v) / npm $(npm -v)" \
  || echo "[Node & Npm] ❌ Incomplete"

# ---------- Python ----------
if has_cmd pip; then
    echo "[PyPI] ✅ $(pip --version | awk '{print $2}')"
elif has_cmd pip3; then
    echo "[PyPI] ✅ $(pip3 --version | awk '{print $2}') (pip3)"
else
    echo "[PyPI] ❌ Not Installed"
fi

if has_cmd python3; then
    HF_VER="$(python3 - <<'EOF'
import importlib.util
s=importlib.util.find_spec("huggingface_hub")
if s:
 import huggingface_hub;print(huggingface_hub.__version__)
EOF
)"
    [ -n "$HF_VER" ] && echo "[HuggingFace] ✅ $HF_VER" || echo "[HuggingFace] ❌ Not Installed"
fi

# ---------- Conda ----------
has_cmd micromamba && echo "[Conda] ✅ via micromamba $(micromamba --version)" \
  || has_cmd conda && echo "[Conda] ✅ via conda $(conda --version | awk '{print $2}')" \
  || echo "[Conda] ❌ Not Installed"

# ---------- Other Languages ----------
has_cmd go && echo "[Go] ✅ $(go version | awk '{print $3}')" || echo "[Go] ❌ Not Installed"

if has_cmd php; then
    echo "[PHP] ✅ $(php -r 'echo PHP_VERSION;')"
    has_cmd composer && echo " └─ [Composer] ✅ $(composer --version 2>/dev/null | awk '{print $3}')"
else
    echo "[PHP] ❌ Not Installed"
fi

has_cmd cargo && echo "[Cargo] ✅ $(cargo --version | awk '{print $2}')" || echo "[Cargo] ❌ Not Installed"
has_cmd conan && echo "[Conan] ✅ $(conan --version | awk '{print $3}')" || echo "[Conan] ❌ Not Installed"
has_cmd dotnet && echo "[NuGet/Dotnet] ✅ $(dotnet --version)" || echo "[NuGet/Dotnet] ❌ Not Installed"

# ---------- Dart ----------
if has_cmd dart; then
    DART_VER=$(dart --version 2>&1 | awk -F 'version: ' '{print $2}' | awk '{print $1}')
    echo "[Dart] ✅ $DART_VER"
else
    echo "[Dart] ❌ Not Installed"
fi

# ---------- Container ----------
has_cmd docker \
  && echo "[Docker] ✅ $(docker --version | awk '{print $3}' | tr -d ',')" \
  || echo "[Docker] ❌ Not Installed"

has_cmd nerdctl \
  && echo "[Nerdctl] ✅ $(nerdctl --version 2>/dev/null | awk '{print $3}')" \
  || echo "[Nerdctl] ❌ Not Installed"

has_cmd helm \
  && echo "[Helm] ✅ $(helm version --short 2>/dev/null | sed 's/^v//')" \
  || echo "[Helm] ❌ Not Installed"

# ---------- Mobile ----------
has_cmd ohpm \
  && echo "[Ohpm] ✅ $(ohpm --version 2>/dev/null | head -n1 | awk '{print $NF}')" \
  || echo "[Ohpm] ❌ Not Installed"

has_cmd pod \
  && echo "[CocoaPods] ✅ $(pod --version --allow-root 2>/dev/null)" \
  || echo "[CocoaPods] ❌ Not Installed"

echo "=========================================="