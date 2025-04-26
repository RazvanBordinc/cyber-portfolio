export function decryptFunction(ciphertext, base64Key) {
  const BLOCK_SIZE = 64;

  // Validate inputs
  if (!ciphertext || !base64Key) return null;

  // Validate ciphertext is a valid hex string
  if (!/^[0-9A-Fa-f]+$/.test(ciphertext)) return null;

  // Ciphertext length must be even
  if (ciphertext.length % 2 !== 0) return null;

  // Validate base64 key format
  var verifyText =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  if (verifyText.test(base64Key) == false) return null;

  try {
    // AES S-box and inverse S-box
    const AES_SBOX = new Uint8Array([
      0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
      0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
      0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
      0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
      0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
      0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
      0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
      0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
      0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
      0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
      0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
      0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
      0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
      0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
      0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
      0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
      0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
      0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
      0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
      0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
      0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
      0xb0, 0x54, 0xbb, 0x16,
    ]);

    const AES_INV_SBOX = new Uint8Array([
      0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
      0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
      0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
      0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
      0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
      0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
      0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
      0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
      0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
      0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
      0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41,
      0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
      0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
      0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
      0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b,
      0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
      0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
      0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
      0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
      0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
      0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
      0x55, 0x21, 0x0c, 0x7d,
    ]);

    // Decode base64 key and extract the four 64-byte keys
    const allKeysBytes = base64ToBytes(base64Key);

    // Check if we have enough key material
    if (!allKeysBytes || allKeysBytes.length < 256) return null;

    const key1 = allKeysBytes.slice(0, 64);
    const key2 = allKeysBytes.slice(64, 128);
    const key3 = allKeysBytes.slice(128, 192);
    const key4 = allKeysBytes.slice(192, 256);

    // Validate all key parts
    if (!key1 || !key2 || !key3 || !key4) return null;
    if (
      key1.length !== 64 ||
      key2.length !== 64 ||
      key3.length !== 64 ||
      key4.length !== 64
    )
      return null;

    // Convert hex string to bytes
    const cipherBytes = new Uint8Array(ciphertext.length / 2);
    for (let i = 0; i < cipherBytes.length; i++) {
      const byteVal = parseInt(ciphertext.substring(i * 2, i * 2 + 2), 16);
      if (isNaN(byteVal)) return null;
      cipherBytes[i] = byteVal;
    }

    // Check that ciphertext size is multiple of block size
    if (cipherBytes.length % BLOCK_SIZE !== 0) return null;
    if (cipherBytes.length === 0) return null;

    // Generate orders for decryption
    const { xOrder, calcOrder } = generateOrders(key2, key3);

    // Verify orders were generated properly
    if (!xOrder || !calcOrder) return null;
    if (xOrder.length !== 64 || calcOrder.length !== 64) return null;

    // Use part of key1 as IV
    const iv = key1.slice(0, BLOCK_SIZE);
    if (iv.length !== BLOCK_SIZE) return null;

    // Decrypt using CBC mode
    const decrypted = decryptCBC(cipherBytes, iv, xOrder, calcOrder, key4);

    // Check if decryption failed
    if (!decrypted) return null;

    // Remove PKCS#7 padding
    const paddingLength = decrypted[decrypted.length - 1];

    // Validate padding
    if (paddingLength === 0 || paddingLength > BLOCK_SIZE) return null;

    // Verify all padding bytes are correct
    for (let i = decrypted.length - paddingLength; i < decrypted.length; i++) {
      if (decrypted[i] !== paddingLength) return null;
    }

    const trimmedDecrypted = decrypted.slice(
      0,
      decrypted.length - paddingLength
    );
    if (!trimmedDecrypted || trimmedDecrypted.length === 0) return null;

    // Convert bytes to text
    try {
      return new TextDecoder("utf-8").decode(trimmedDecrypted);
    } catch (e) {
      return null; // Error decoding UTF-8
    }
  } catch (e) {
    // Catch any unexpected errors
    console.error("Decryption error:", e);
    return null;
  }

  // Helper function: Convert base64 to byte array
  function base64ToBytes(base64) {
    try {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (e) {
      return null; // Error in base64 decoding
    }
  }

  // Helper function: Generate orders for the Feistel network
  function generateOrders(key2, key3) {
    try {
      // Create xOrder - distinct indices in 0-63 range ordered by key2 values
      const xOrderPairs = [];
      for (let i = 0; i < key2.length; i++) {
        xOrderPairs.push({ value: key2[i], index: i });
      }
      xOrderPairs.sort((a, b) => b.value - a.value); // Descending

      const xOrder = xOrderPairs.map((pair) => pair.index);

      // Create calcOrder - values in 0-7 range (key3 values modulo 8)
      const calcOrder = Array.from(key3.slice(0, 64)).map((val) => val % 8);

      return { xOrder, calcOrder };
    } catch (e) {
      return null; // Error generating orders
    }
  }

  // Helper function: Decrypt using CBC mode
  function decryptCBC(ciphertext, iv, xOrder, calcOrder, key4) {
    if (ciphertext.length % BLOCK_SIZE !== 0) {
      return null; // Invalid ciphertext length
    }

    try {
      const plaintext = new Uint8Array(ciphertext.length);
      let previousBlock = iv;

      // Process each block
      for (let i = 0; i < ciphertext.length; i += BLOCK_SIZE) {
        const encryptedBlock = ciphertext.slice(i, i + BLOCK_SIZE);

        // Validate block size
        if (encryptedBlock.length !== BLOCK_SIZE) return null;

        // Decrypt the block
        const decryptedBlock = feistelDecryptBlock(
          encryptedBlock,
          16,
          xOrder,
          calcOrder,
          key4
        );

        // Check if block decryption failed
        if (!decryptedBlock) return null;

        // XOR with previous ciphertext block
        for (let j = 0; j < BLOCK_SIZE; j++) {
          plaintext[i + j] = decryptedBlock[j] ^ previousBlock[j];
        }

        // Set for next iteration
        previousBlock = encryptedBlock;
      }

      return plaintext;
    } catch (e) {
      return null; // Error in CBC decryption
    }
  }

  // Helper function: Feistel network block decryption
  function feistelDecryptBlock(block, rounds, xOrder, calcOrder, key4) {
    if (!block || block.length !== BLOCK_SIZE) {
      return null; // Invalid block size
    }

    try {
      const half = block.length / 2;
      let L = block.slice(0, half);
      let R = block.slice(half);

      if (L.length !== half || R.length !== half) return null;

      for (let round = 0; round < rounds; round++) {
        const newL = new Uint8Array(half);

        for (let j = 0; j < half; j++) {
          const permIndex = xOrder[j];
          if (permIndex === undefined) return null;

          const lByteIndex = permIndex < half ? permIndex : permIndex - half;
          if (lByteIndex < 0 || lByteIndex >= half) return null;

          const lByte = L[lByteIndex];
          if (lByte === undefined) return null;

          const op = calcOrder[j] & 7;
          if (op === undefined) return null;

          const f = selOps(lByte, op, key4);
          if (f === null) return null;

          newL[j] = R[j] ^ f;
        }

        R = L;
        L = newL;
      }

      // Concatenate L and R
      const result = new Uint8Array(BLOCK_SIZE);
      result.set(L, 0);
      result.set(R, half);

      return result;
    } catch (e) {
      return null; // Error in Feistel decryption
    }
  }

  // Helper function: Operation selector for the Feistel function
  function selOps(b, op, k4) {
    if (b === undefined || op === undefined || !k4) return null;

    try {
      switch (op & 7) {
        case 0:
          return b ^ k4[0];
        case 1:
          if (b >= AES_SBOX.length || b < 0) return null;
          return AES_SBOX[b] ^ k4[1];
        case 2:
          return (b << (k4[2] & 7)) | (b >>> (8 - (k4[2] & 7)));
        case 3:
          return (b + k4[0]) & 0xff;
        case 4:
          return (b * 5) & 0xff;
        case 5:
          return (b * 13) & 0xff;
        case 6:
          return b ^ ((b << 4) | (b >>> 4));
        case 7:
          if (b >= AES_INV_SBOX.length || b < 0) return null;
          return AES_INV_SBOX[b] ^ k4[2];
        default:
          return b;
      }
    } catch (e) {
      return null; // Error in operation
    }
  }
}
