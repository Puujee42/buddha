#!/bin/bash
echo "Building Rust Wasm module..."

if ! command -v wasm-pack &> /dev/null; then
    echo "wasm-pack could not be found. Please install it: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh"
    exit 1
fi

cd rust-modules
wasm-pack build --target bundler

echo "Build complete. Now run: npm install ./rust-modules/pkg"
