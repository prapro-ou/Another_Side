# memo: docker pull plantuml/plantuml:1.2023.9
# pumlファイルからpngファイルのクラス図の作成
puml:
	cat docs/class_diagram.puml | docker run --rm -i plantuml/plantuml:1.2023.9 -pipe -tpng > docs/class_diagram.png

# Docker でゲーム用のサーバを立てる．
# 基本的に最初の一回だけ使用し，以降は start を使う．
# 開発メンバはリーダーの支持がない限り使用しない．
run:
	docker run --name another_side -v ${PWD}:/usr/share/nginx/html:ro -p 8080:80 -d nginx

# Docker でゲーム用のサーバを立てて Web ページを開く．
# 基本的にこのコマンドでサーバを立てる．
start:
	docker start another_side
	open http://localhost:8080 2>/dev/null

# Docker で開いているゲーム用のサーバを停止する．
# 次回は make start で再開する．
stop:
	docker stop another_side
