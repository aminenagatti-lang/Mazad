const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "application/pdf": [0x25, 0x50, 0x44, 0x46],
};

export async function validateUpload(file: File): Promise<void> {
  if (!ALLOWED_MIME_TYPES.includes(file.type))
    throw new Error("Type de fichier non autorisé (JPG, PNG, PDF uniquement)");

  if (file.size > MAX_FILE_SIZE)
    throw new Error("Fichier trop volumineux (maximum 5MB)");

  if (file.size === 0) throw new Error("Fichier vide");

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer.slice(0, 4));
  const expectedBytes = MAGIC_BYTES[file.type];

  if (expectedBytes) {
    const matches = expectedBytes.every((byte, i) => bytes[i] === byte);
    if (!matches) throw new Error("Fichier corrompu ou type incorrect");
  }
}
