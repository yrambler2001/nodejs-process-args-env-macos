const addon = require('bindings')('addon.node');

const bufferToString = (buffer) => buffer.toString('utf-8'); // confirmed case that utf8 parameters are split into two (or more) bytes so it is utf-8

const bufferMacOs = addon.process(+process.argv[2]);
// const bufferMacOs = addon.process(process.pid);

const buffer = bufferMacOs;
// const buffer = Buffer.from(require('./mockSipOnAccessibleProcess'), 'hex');

// debug:
// console.log(bufferToString(buffer))
// console.log(buffer.toString('hex'))

const sizeofCppInt = 4;
const buffersWithStrings = [];

const argvCount = buffer[0];

// split by 00
for (let start = sizeofCppInt, end = sizeofCppInt; end <= buffer.length; end += 1) {
  const nextSymbolIsZero = buffer[end + 1] === 0; // to add a buffer after data is read
  const currentSymbolIsZeroAndNextIsNot = buffer[end + 1] !== 0 && buffer[end] === 0; // to add a buffer when it is the last zero in a sequence of zeroes
  if (nextSymbolIsZero || currentSymbolIsZeroAndNextIsNot) {
    buffersWithStrings.push(buffer.subarray(start, end + 1));
    start = end + 1;
  }
}

// test:
// console.log('parsed is equal to input: ', mock.endsWith(buffersWithStrings.reduce((str, buffer) => str + buffer.toString('hex'), '')))

const binaryPath = buffersWithStrings[0];

const isEmptyBuffer = (buffer) => buffer?.length === 1 && buffer?.[0] === 0;

const argv = [];
let i = 1;
for (; i < buffersWithStrings.length; i += 1) {
  const buffer = buffersWithStrings[i];
  if (!isEmptyBuffer(buffer)) {
    argv.push(buffer);
    if (argv.length === argvCount) break;
  }
}
const envs = [];
for (i += 1; i < buffersWithStrings.length; i += 1) {
  if (!isEmptyBuffer(buffersWithStrings[i])) envs.push(buffersWithStrings[i]);
  if (isEmptyBuffer(buffersWithStrings[i + 1]) && isEmptyBuffer(buffersWithStrings[i + 2])) break;
}

const macOsVars = [];
for (i += 1; i < buffersWithStrings.length; i += 1) {
  if (!isEmptyBuffer(buffersWithStrings[i])) macOsVars.push(buffersWithStrings[i]);
}

const stringBinaryPath = bufferToString(binaryPath);
const stringArgv = argv.map(bufferToString);
const stringEnvs = envs.map(bufferToString);
const stringMacOsVars = macOsVars.map(bufferToString);

if (process.argv[3])
  console.log(
    JSON.stringify({
      stringBinaryPath,
      stringArgv,
      stringEnvs,
      stringMacOsVars,
    }),
  );
else {
  console.log('Binary path:');
  console.log(stringBinaryPath);

  console.log('\nBinary argv:');
  console.log(stringArgv.join('\n'));

  console.log('\nBinary env:');
  console.log(stringEnvs.join('\n'));

  console.log('\nBinary MacOS Variables:');
  console.log(stringMacOsVars.join('\n'));
}
