export function validateHash({
  hash,
  difficulty = 4,
  prefix = '0'
}: ValidateHash) {
  const check = prefix.repeat(difficulty);

  return hash.startsWith(check);
}
