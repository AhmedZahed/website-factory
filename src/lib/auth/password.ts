const PASSWORD_HASH_SCHEME = "pbkdf2-sha256";
export const PASSWORD_HASH_ITERATIONS = 600_000;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_HASH_BITS = 256;
const textEncoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function derivePasswordHash(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const saltForCrypto = new Uint8Array(salt);
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: saltForCrypto.buffer, iterations },
    key,
    PASSWORD_HASH_BITS,
  );
  return new Uint8Array(bits);
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 14 || password.length > 128) {
    throw new Error("Password must contain 14 to 128 characters");
  }

  const salt = crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_BYTES));
  const hash = await derivePasswordHash(
    password,
    salt,
    PASSWORD_HASH_ITERATIONS,
  );
  return [
    PASSWORD_HASH_SCHEME,
    PASSWORD_HASH_ITERATIONS,
    toBase64Url(salt),
    toBase64Url(hash),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  encodedHash: string,
): Promise<boolean> {
  const [scheme, rawIterations, encodedSalt, encodedExpectedHash, extra] =
    encodedHash.split("$");
  const iterations = Number(rawIterations);

  if (
    scheme !== PASSWORD_HASH_SCHEME ||
    extra !== undefined ||
    !Number.isSafeInteger(iterations) ||
    iterations < PASSWORD_HASH_ITERATIONS ||
    iterations > 1_000_000
  ) {
    return false;
  }

  try {
    const salt = fromBase64Url(encodedSalt);
    const expectedHash = fromBase64Url(encodedExpectedHash);
    if (salt.length !== PASSWORD_SALT_BYTES || expectedHash.length !== 32) {
      return false;
    }

    const actualHash = await derivePasswordHash(password, salt, iterations);
    return constantTimeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}
