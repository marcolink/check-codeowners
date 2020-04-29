import * as readline from "readline";
import {Readable} from "stream";

export type CodeOwnersEntry = { pattern: string, owners: string[] };
export type CodeOwners = CodeOwnersEntry[];

class ReadableString extends Readable {
  private sent = false;

  constructor(private str: string) {
    super();
  }

  _read() {
    if (!this.sent) {
      this.push(Buffer.from(this.str));
      this.sent = true
    } else {
      this.push(null)
    }
  }
}

const parseCodeOwners = async (content: string): Promise<CodeOwners> => {
  const stream = readline.createInterface({
    input: new ReadableString(content)
  });

  return new Promise<CodeOwners>(resolve => {
    const result: CodeOwners = [];

    stream.on('line', (line) => {
      line = line.trim();
      if (line.startsWith('#') || line.length === 0) {
        return;
      }
      const parts = line.split(' ').filter(p => p !== '');
      const key = parts.shift();
      if (key !== undefined) {
        result.push({pattern: key, owners: parts});
      }
    });

    stream.on('close', () => {
      resolve(result);
    });

  });
};

export {parseCodeOwners};
