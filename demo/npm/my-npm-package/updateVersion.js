const fs = require('fs');
const path = require('path');

// 读取 package.json 文件
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// 生成随机版本号
const newVersion = generateRandomVersion(); // 随机生成版本号，可能包含预发布版本
packageJson.version = newVersion;

// 写回 package.json 文件
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`New random version: ${newVersion}`);

// 生成随机版本号的函数
function generateRandomVersion() {
  // 随机生成主版本号、次版本号和修订号
  const major = Math.floor(Math.random() * 10); // 0-99
  const minor = Math.floor(Math.random() * 10); // 0-99
  const patch = Math.floor(Math.random() * 10); // 0-99

  let version = `${major}.${minor}.${patch}`;

  // 随机决定是否生成预发布版本
  const shouldIncludePreRelease = Math.random() < 0.5; // 50% 的概率生成预发布版本
  if (shouldIncludePreRelease) {
    // 随机选择一个预发布类型
    const preReleaseTypes = ['alpha', 'beta', 'rc'];
    const randomType = preReleaseTypes[Math.floor(Math.random() * preReleaseTypes.length)];

    // 随机生成预发布版本号
    const preReleaseNumber = Math.floor(Math.random() * 10) + 1; // 1-10
    version += `-${randomType}.${preReleaseNumber}`;
  }

  return version;
}
