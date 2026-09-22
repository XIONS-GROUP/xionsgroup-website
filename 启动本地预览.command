#!/bin/bash
# 双击即可启动本地预览与设计工具箱。不需要助手在场。
# macOS 会用「终端」打开 .command 文件；这个窗口要一直开着，关掉就等于停止预览。

cd "$(dirname "$0")" || exit 1

PORT=4323
SITE="http://127.0.0.1:$PORT/fr/"
TOOLBOX="http://127.0.0.1:$PORT/design-preview/"

if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "本地预览已经在运行，直接打开浏览器。"
  echo "网站    $SITE"
  echo "工具箱  $TOOLBOX"
  open "$TOOLBOX"
  exit 0
fi

if [ ! -d node_modules ]; then
  echo "首次运行，正在安装依赖，这一步可能要几分钟……"
  npm ci || { echo "依赖安装失败。"; read -r -p "按回车关闭。"; exit 1; }
fi

echo "正在启动本地预览……"
npm run dev -- --host 127.0.0.1 --port "$PORT" &
SERVER_PID=$!

# 等服务器真正能响应了再开浏览器，否则会看到连接错误
for _ in $(seq 1 60); do
  if curl -fsS -o /dev/null "$SITE" 2>/dev/null; then
    open "$TOOLBOX"
    break
  fi
  sleep 0.5
done

echo ""
echo "─────────────────────────────────────────────"
echo "网站    $SITE"
echo "工具箱  $TOOLBOX"
echo ""
echo "这个窗口要一直开着。"
echo "按 Control-C 或关闭窗口就会停止预览。"
echo "─────────────────────────────────────────────"

wait "$SERVER_PID"
