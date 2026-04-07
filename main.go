package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
)

// Статические файлы страницы вшиваются в бинарник (удобно для деплоя одним файлом).
//go:embed index.html styles.css app.js
var static embed.FS

func main() {
	root, err := fs.Sub(static, ".")
	if err != nil {
		log.Fatal(err)
	}

	addr := ":8080"
	if p := os.Getenv("PORT"); p != "" {
		addr = ":" + p
	}

	http.Handle("/", http.FileServer(http.FS(root)))

	log.Printf("статика: http://127.0.0.1%s/\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
