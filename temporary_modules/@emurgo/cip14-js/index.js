"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blake2b_1 = __importDefault(require("blake2b"));
const bech32_1 = require("bech32");
/// note: this function can't be inverted due to the hash
const DATA = "asset";
class AssetFingerprint {
    constructor(hashBuf) {
        this.hashBuf = hashBuf;
    }
    static fromHash(hash) {
        return new AssetFingerprint(hash);
    }
    static fromParts(policyId, assetName) {
        // see https://github.com/cardano-foundation/CIPs/pull/64
        const hashBuf = (0, blake2b_1.default)(20)
            .update(new Uint8Array([...policyId, ...assetName]))
            .digest("binary");
        return AssetFingerprint.fromHash(hashBuf);
    }
    static fromBech32(fingerprint) {
        const { prefix, words } = bech32_1.bech32.decode(fingerprint);
        if (prefix !== DATA) {
            throw new Error("Invalid asset fingerprint");
        }
        const hashBuf = Buffer.from(bech32_1.bech32.fromWords(words));
        return AssetFingerprint.fromHash(hashBuf);
    }
    fingerprint() {
        const words = bech32_1.bech32.toWords(this.hashBuf);
        return bech32_1.bech32.encode(DATA, words);
    }
    hash() {
        return Buffer.from(this.hashBuf).toString("hex");
    }
    prefix() {
        return DATA;
    }
    // The last six characters of the data part form a checksum and contain no information
    checksum() {
        return this.fingerprint().slice(-6);
    }
}
exports.default = AssetFingerprint;
