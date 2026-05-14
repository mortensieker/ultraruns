.PHONY: install dev build preview check clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

check:
	npm run check

clean:
	rm -rf node_modules dist .astro
