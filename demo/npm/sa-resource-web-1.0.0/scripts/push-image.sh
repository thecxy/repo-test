#bin/bash
time=$(date "+%Y%m%d%H%M%S")

rm -rf ./dist/

npm run  build:pro

node ./scripts/modifyJson.js

docker build -t  registry.baidubce.com/gitee-test/gitee-sa-resource-web:release-$time .

docker push  registry.baidubce.com/gitee-test/gitee-sa-resource-web:release-$time
