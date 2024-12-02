import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

// 从 package.json 中导入版本号
const packageJsonPath = path.join(path.resolve(), 'package.json');
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const __dirname = path.resolve(); // 获取当前目录
const output = fs.createWriteStream(path.join(__dirname, `vpnkeeper-v${version}.zip`)); // 使用版本号命名 ZIP 文件
const archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log(`打包完成，文件名为 vpnkeeper-v${version}.zip`);
});

archive.on('error', function(err) {
  throw err;
});

// 开始打包
archive.pipe(output);

// 添加文件和文件夹
archive.directory('dist/', false); // 添加 dist 文件夹
archive.directory('public/', false); // 添加 public 文件夹
archive.directory('src/', false); // 添加 src 文件夹
archive.file('package.json', { name: 'package.json' }); // 添加 package.json
archive.file('tsconfig.json', { name: 'tsconfig.json' }); // 添加 tsconfig.json

// 完成打包
archive.finalize();
