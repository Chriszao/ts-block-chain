import { BinaryLike, createHash } from 'crypto';

interface HashPayload {
  hash: string;
  difficulty: number;
  prefix: string;
}

export function hash(data: BinaryLike): string {
  return createHash('sha256').update(data).digest('hex');
}

export function isHashProofed({
  hash,
  difficulty = 4,
  prefix = '0'
}: HashPayload) {
  const check = prefix.repeat(difficulty);

  return hash.startsWith(check);
}
