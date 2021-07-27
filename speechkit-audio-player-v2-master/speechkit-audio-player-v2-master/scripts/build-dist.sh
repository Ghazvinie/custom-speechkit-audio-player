#!/bin/bash

echo "> Start build"

rm -rf ./dist/
mkdir -p ./dist/
export NODE_ENV="production"
RELEASE=true SOURCEMAP='hidden' yarn run build
cd ./dist/ || exit 1
mkdir -p ./dist/
cp -R ../packages/player/build/* ./dist
cd ./dist/ || exit 1
find . -name '*.map' -type f | cpio -updm ../sourcemap/
find . -name '*.map' -type f -exec rm {} \;
cd ..

echo "> Complete build"
