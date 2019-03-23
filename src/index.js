const { encode, decode } = require("./coder");

const getTask = () => {
  const task = process.argv.slice(2).find(x => {
    const s = x.toUpperCase();
    return s === "--DECODE" || s === "--ENCODE";
  });
  if (task) {
    return task.toUpperCase();
  } else {
    throw new Error("Task Mode Missing: --decode or --encode");
  }
};

const main = async () => {
  const task = getTask();

  if (task === "--DECODE") {
    decode();
  } else {
    encode();
  }
};

main();
