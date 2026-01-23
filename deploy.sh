#!/bin/bash
# 使用方法: ./deploy.sh <ユーザー名> <環境>
set -e

USER_NAME=$1
ENV=$2

if [ -z "$USER_NAME" ]; then
    echo "エラー: ユーザー名が提供されていません。"
    exit 1
fi

# パスの定義を「共通の公開ディレクトリ」に変更
APP_DIR="/app/$USER_NAME"
# $USER_NAME を取って、Nginxのルート直下を指定
WEB_DIR="/usr/share/nginx/html"

echo "--- $ENV 環境の処理を開始します ---"

if [ ! -d "/app" ]; then
    echo "GitHub Actions環境を検知しました。正常終了させます。"
    exit 0
else
    echo "サーバ環境でのデプロイを実行します。"

    if [ -d "$APP_DIR" ]; then
        cd "$APP_DIR"
    fi

    # Webファイルのコピー
    if [ -d "./src/web" ]; then
        # 1. まず全ファイルをコピー
        cp -ipr ./src/web/* "$WEB_DIR/"
        
        # 2. add.html を index.html として一番上にコピー（これでドメイン直下で表示される）
        cp -ip ./src/web/customer/add.html "$WEB_DIR/index.html"
        
        echo "Webファイルの更新（ルート直下への反映）が完了しました。"
    fi
fi

echo "--- $ENV 処理完了 ---"
