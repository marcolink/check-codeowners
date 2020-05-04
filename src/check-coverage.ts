import micromatch from "micromatch";
import {CodeOwners} from "./parse-code-owners";

const checkCoverage = (files: string[], codeowners: CodeOwners): string[] => {
  return codeowners.reduce((matched: string[], codeOwnersEntry) =>
    [...matched, ...micromatch(files, codeOwnersEntry.pattern, {basename: true})], []);
};

export {checkCoverage};
