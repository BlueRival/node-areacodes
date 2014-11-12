test: install-dev
	node_modules/mocha/bin/mocha -b -u bdd test/default

auto-test: install-dev
	node_modules/mocha/bin/mocha -b -u bdd --reporter list -w test/default

install:
	make clean
	npm install --production

install-dev:
ifeq ($(wildcard node_modules/mocha),)
	make clean
	npm install
endif

clean:
	rm -rf node_modules install-dev

.PHONY: test auto-test install install-dev clean
