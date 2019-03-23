const { encode, decode } = require("./coder");
const { getTask, getFrom, getTo } = require("./utils");

const main = async () => {
  const task = getTask();
  const from = getFrom();
  const to = getTo();

  if (task === "--DECODE") {
    decode(from, to);
  } else {
    encode(from, to);
  }
};

main();
