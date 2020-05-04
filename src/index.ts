import {Command, flags} from '@oclif/command'
import chalk from "chalk";
import * as fs from "fs-extra";
import * as path from "path";
import recursive from "recursive-readdir";
import {table} from "table";
import {checkCoverage} from "./check-coverage";
import {parseCodeOwners} from "./parse-code-owners";

class CheckCodeOwners extends Command {
  static description = 'check codeowners project coverage';

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'project'}];

  async run() {
    const {args, flags} = this.parse(CheckCodeOwners);

    const project = args.project || __dirname;
    const codeOwnersFilePath = path.resolve(project, '.github', 'CODEOWNERS');

    if (!fs.existsSync(codeOwnersFilePath)) {
      this.error(`No CODEOWNERS file detected ${codeOwnersFilePath}`);
      return;
    }

    const valueFormat = chalk.yellow;
    const files = await recursive(project);
    const parsedCodeOwners = await parseCodeOwners((await fs.readFile(codeOwnersFilePath)).toString());
    const content = parsedCodeOwners.map(entry => [...Object.values(entry)
      .map((value) => valueFormat(value))]);

    const coveredFiles = checkCoverage(files, parsedCodeOwners);
    const percentage = ((coveredFiles.length / files.length) * 100).toFixed(2);

    console.log(table([[chalk.bold('pattern'), chalk.bold('codeowners')], ...content], {}));
    console.log(`${valueFormat(coveredFiles.length)}/${valueFormat(files.length)} ${valueFormat(percentage + '%')} files covered by codeowners`);
  }
}

export = CheckCodeOwners;
