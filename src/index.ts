import {Command, flags} from '@oclif/command'
import * as fs from "fs-extra";
import * as path from "path";
import recursive from "recursive-readdir";
import {parseCodeOwners} from "./parse-code-owners";
import {checkCoverage} from "./check-coverage";

class CheckCodeOwners extends Command {
  static description = 'check codeowners project coverage';

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'project'}];

  async run() {
    const {args} = this.parse(CheckCodeOwners);

    const project = args.project || __dirname;
    const codeOwnersFilePath = path.resolve(project, '.github', 'CODEOWNERS');

    if (!fs.existsSync(codeOwnersFilePath)) {
      this.error(`No CODEOWNERS file detected ${codeOwnersFilePath}`);
      return;
    }

    const files = await recursive(project);
    console.log(`${files.length} files found`);

    const parsedCodeOwners = await parseCodeOwners((await fs.readFile(codeOwnersFilePath)).toString());
    console.log(`${parsedCodeOwners.length} codeowners pattern found`);

    const coveredFiles = checkCoverage(files, parsedCodeOwners);
    const percentage = ((coveredFiles.length / files.length) * 100).toFixed(2);
    console.log(`${coveredFiles.length} (${percentage}%) files covered by codeowners`);

  }
}

export = CheckCodeOwners;
