import {CodeOwnersEntry, CodeOwners, parseCodeOwners} from "../src/parse-code-owners";
import {expect} from "@oclif/test";

/*
const hasPattern = (codeowners: CodeOwnersList, pattern: string): boolean => {
  return codeowners.some(owner => owner.pattern === pattern);
};
*/

const owners = (codeowners: CodeOwners, pattern: string): CodeOwnersEntry | undefined => {
  return codeowners.find(owner => owner.pattern === pattern);
};

describe('a readCodeOwners function', async () => {
  it('reads a CODEOWNERS string', async () => {
    const content = `
      *.js @js-owner
    `;
    const result = await parseCodeOwners(content);
    expect(result,).to.eql([{pattern: '*.js', owners: ['@js-owner']}]);
  });

  it('parses a CODEOWNERS string with multiple spaces', async () => {
    const content = `
      *.js    @js-owner
    `;
    const result = await parseCodeOwners(content);
    expect(result,).to.eql([{pattern: '*.js', owners: ['@js-owner']}]);
  });

  it('parses a CODEOWNERS string with empty lines', async () => {
    const content = `

      *.js @js-owner

    `;
    const result = await parseCodeOwners(content);
    expect(result,).to.eql([{pattern: '*.js', owners: ['@js-owner']}]);
  });

  it('parses a CODEOWNERS string with comments', async () => {
    const content = `
      # best comment ever
      *.js @js-owner
    `;
    const result = await parseCodeOwners(content);
    expect(result,).to.eql([{pattern: '*.js', owners: ['@js-owner']}]);
  });

  it('parses a CODEOWNERS string with multiple lines', async () => {
    const content = `
      *.js @js-owner
      /build/logs/ @doctocat
    `;
    const result = await parseCodeOwners(content);
    expect(result).to.length(2);
  });

  it('parses a CODEOWNERS string with multiple owners per line', async () => {
    const content = `
      *.js @js-owner @js-owner2 @js-owner3
    `;
    const result = await parseCodeOwners(content);
    expect(result).to.length(1);
    expect(owners(result, '*.js')!.owners).to.length(3);
  });

});
