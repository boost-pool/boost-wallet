export default class AssetFingerprint {
    readonly hashBuf: Uint8Array;
    private constructor();
    static fromHash(hash: Uint8Array): AssetFingerprint;
    static fromParts(policyId: Uint8Array, assetName: Uint8Array): AssetFingerprint;
    static fromBech32(fingerprint: string): AssetFingerprint;
    fingerprint(): string;
    hash(): string;
    prefix(): string;
    checksum(): string;
}
