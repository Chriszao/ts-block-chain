import { hash, isHashProofed } from './helpers';

export interface Block {
  header: {
    nonce: number;
    blockHash: string;
  };
  payload: {
    sequence: number;
    timestamp: number;
    data: any;
    previousHash: string;
  };
}

export class Blockchain {
  #chain: Block[] = [];
  private powPrefix = '0';

  constructor(private readonly difficulty = 4) {
    this.#chain.push(this.createGenesisBlock());
  }

  private createGenesisBlock(): Block {
    const payload: Block['payload'] = {
      sequence: 0,
      timestamp: +new Date(),
      data: 'Genesis Block',
      previousHash: ''
    };

    return {
      payload,
      header: {
        nonce: 0,
        blockHash: hash(JSON.stringify(payload))
      }
    };
  }

  private get lastBlock(): Block {
    return this.#chain.at(-1) as Block;
  }

  get chain(): Block[] {
    return this.#chain;
  }

  private getPreviousBlockHash(): string {
    return this.lastBlock.header.blockHash;
  }

  createBlock(data: any): Block['payload'] {
    const newBlock: Block['payload'] = {
      data,
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: +new Date(),
      previousHash: this.getPreviousBlockHash()
    };

    console.log(
      `Created Block ${newBlock.sequence}: ${JSON.stringify(newBlock, null, 2)}`
    );

    return newBlock;
  }

  mineBlock(block: Block['payload']) {
    let nonce = 0;
    const startTime = +new Date();

    while (true) {
      const blockHash = hash(JSON.stringify(block));
      const proofingHash = hash(blockHash + nonce);

      const hashPayload = {
        prefix: this.powPrefix,
        difficulty: this.difficulty,
        hash: proofingHash
      };

      if (isHashProofed(hashPayload)) {
        const endTime = +new Date();
        const shortHash = blockHash.slice(0, 12);
        const minedTime = (endTime - startTime) / 1000;

        console.log(
          `Mined block ${block.sequence} in ${minedTime}s. Hash ${shortHash} (${nonce} attempts)`
        );

        return {
          minedBlock: {
            payload: block,
            header: {
              nonce,
              blockHash
            }
          }
        };
      }
      nonce++;
    }
  }

  verifyBlock(block: Block): boolean {
    if (block.payload.previousHash !== this.getPreviousBlockHash()) {
      console.error(
        `Invalid block #${
          block.payload.sequence
        }: Previous block hash is ${this.getPreviousBlockHash().slice(
          0,
          12
        )} not ${block.payload.previousHash.slice(0, 12)}\n`
      );

      return false;
    }

    const hashProof = {
      hash: hash(hash(JSON.stringify(block.payload)) + block.header.nonce),
      difficulty: this.difficulty,
      prefix: this.powPrefix
    };

    if (!isHashProofed(hashProof)) {
      console.error(
        `Invalid block #${block.payload.sequence}: Hash is not proofed, nonce ${block.header.nonce} is invalid.`
      );

      return false;
    }

    return true;
  }

  pushBlock(block: Block): Block[] {
    if (this.verifyBlock(block)) {
      this.#chain.push(block);

      console.log(
        `Block #${
          block.payload.sequence
        } was added to the blockchain: ${JSON.stringify(block, null, 2)}\n`
      );
    }

    return this.#chain;
  }
}
