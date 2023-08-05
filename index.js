const { Worker } = require("worker_threads");

function chunkify(array, n) {
  let chunks = [];

  for (let i = n; i > 0; i--) {
    chunks.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return chunks;
}

function run(jobs, concurrentWorks) {
  const chunks = chunkify(jobs, concurrentWorks);

  const tick = performance.now();
  let completedWorkers = 0;

  chunks.forEach((data, i) => {
    const worker = new Worker("./worker.js");
    worker.postMessage(data);
    worker.on("message", () => {
      console.log(`Worker ${i} done`);
      completedWorkers++;
      if (completedWorkers === concurrentWorks) {
        console.log(
          `${concurrentWorks} workers took ${performance.now() - tick} ms`
        );
        process.exit();
      }
    });
  });
}

const jobs = Array.from({ length: 100 }, () => 1e9);
const concurrentWorks = [];

run(jobs, 6);
