const { encode, decode } = require("./coder");
const { getTask, getFrom, getTo } = require("./utils");

const main = async () => {
  const task = getTask();

  if (task === "--DECODE") {
    decode();
  } else {
    encode();
  }
};

main();
