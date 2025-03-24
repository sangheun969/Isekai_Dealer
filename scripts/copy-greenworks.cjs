const fs = require("fs");
const path = require("path");

const srcPath = path.join(
  __dirname,
  "../node_modules/greenworks/lib/greenworks-win64.node"
);
const destDir = path.join(__dirname, "../dist/node_modules/greenworks/lib/");
const destPath = path.join(destDir, "greenworks-win64.node");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, destPath);
  console.log("✅ greenworks-win64.node 파일 복사 완료!");
} else {
  console.error("❌ greenworks-win64.node 파일을 찾을 수 없습니다!");
}
