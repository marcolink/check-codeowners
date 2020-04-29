import {checkCoverage} from "../src/check-coverage";
import {CodeOwners} from "../src/parse-code-owners";

describe('A check-coverage function', () => {

  it('does smth', () => {

    const files = [
      '/package/file.js',
      '/package/file2.js',
      '/package/file3.js',
      '/package/file3.ts',
    ];

    const codeOwners: CodeOwners = [
      {pattern: '*.js', owners: ['marcolink']}
    ];

    checkCoverage(files, codeOwners);
  })

});
