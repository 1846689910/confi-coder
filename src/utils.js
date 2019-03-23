function getTask() {
  const task = process.argv.slice(2).find(x => {
    const s = x.toUpperCase();
    return s === "--DECODE" || s === "--ENCODE";
  });
  if (task) {
    return task.toUpperCase();
  } else {
    throw new Error("Task Mode Missing: --decode or --encode");
  }
}

function getFrom() {
  const from = process.argv.slice(2).find(x => x.toUpperCase().startsWith("FROM"));
  return from && from.split("=")[1];
}

function getTo() {
  const to = process.argv.slice(2).find(x => x.toUpperCase().startsWith("TO"));
  return to && to.split("=")[1];
}

module.exports = {
  getTask,
  getFrom,
  getTo
};
