const { encode, decode } = require("./coder");
const { getTask, getFrom, getTo } = require("./utils");

const main = async () => {
  const task = getTask();
  const from = getFrom();
  const to = getTo();

  if (task === "--DECODE") {
    console.log([from, to]);
    decode(from, to);
  } else {
    encode(from, to);
  }
};

main();
