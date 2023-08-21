"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const child_process_1 = require("child_process");
async function run() {
    try {
        const user = core.getInput('user');
        const password = core.getInput('password');
        const tag = core.getInput('tag');
        const dockerImagePath = core.getInput('docker-image-path');
        (0, child_process_1.execSync)(`sudo ctr i import ${dockerImagePath}`, { stdio: 'inherit' });
        (0, child_process_1.execSync)(`sudo ctr i push --user "${user}:${password}" ${tag}`, { stdio: 'inherit' });
        (0, child_process_1.execSync)(`sudo soci create ${tag}`, { stdio: 'inherit' });
        (0, child_process_1.execSync)(`sudo soci push --user "${user}:${password}" ${tag}`, { stdio: 'inherit' });
        core.setOutput('tag', tag);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
exports.run = run;
