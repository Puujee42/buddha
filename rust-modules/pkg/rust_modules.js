import * as wasm from "./rust_modules_bg.wasm";
export * from "./rust_modules_bg.js";
import { __wbg_set_wasm } from "./rust_modules_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
