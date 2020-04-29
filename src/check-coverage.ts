import {CodeOwners} from "./parse-code-owners";
import micromatch from "micromatch";

const checkCoverage = (files: string[], codeowners: CodeOwners): string[] => {
  return codeowners.reduce((matched: string[], codeOwnersEntry) =>
    [...matched, ...micromatch(files, codeOwnersEntry.pattern, {basename: true})], []);
};

export {checkCoverage};
