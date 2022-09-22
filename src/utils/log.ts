import { format } from 'util';

/* TODO:
  make log function as useful alternative for console.log,
  it must be able to print array of any types arguments
  even object. only in one line, but literals
*/

function log(msg: any) {
  console.log(format(msg).replaceAll('\n', '').replaceAll(/[ ]+/gm, ' '));
}

export default log;
