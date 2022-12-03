import { Blockchain } from './blockchain';

const difficulty = Number(process.argv[2]) || 4;

const blockchain = new Blockchain(difficulty);

const blocksNumber = Number(process.argv[3]) || 10;
let chain = blockchain.chain;

for (let index = 1; index <= blocksNumber; index++) {
  const block = blockchain.createBlock(`Block ${index}`);
  const mineInfo = blockchain.mineBlock(block);
  chain = blockchain.pushBlock(mineInfo.minedBlock);
}

console.log('--- BLOCKCHAIN ---');
console.log(chain);
