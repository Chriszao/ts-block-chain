import { BinaryLike, createHash } from 'crypto';

interface ValidateHash {
  hash: string;
  difficulty: number;
  prefix: string;
}

export function hash(data: BinaryLike): string {
  return createHash('sha256').update(data).digest('hex');
}

export function validateHash({
  hash,
  difficulty = 4,
  prefix = '0'
}: ValidateHash) {
  const check = prefix.repeat(difficulty);

  return hash.startsWith(check);
}
