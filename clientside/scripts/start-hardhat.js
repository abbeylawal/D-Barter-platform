// const { exec } = require("child_process");

// // Start the Hardhat node
// exec(
//   "npx hardhat node --config ./SmartContract/hardhat.config.js",
//   (err, stdout, stderr) => {
//     if (err) {
//       console.error(`Error starting Hardhat node: ${err.message}`);
//       return;
//     }
//     console.log(`Hardhat node output: ${stdout}`);

//     // Deploy the smart contract
//     exec(
//       "npx hardhat run ./scripts/deploy.js --network localhost",
//       (err, stdout, stderr) => {
//         if (err) {
//           console.error(`Error deploying contract: ${err.message}`);
//           return;
//         }
//         console.log(`Deployment output: ${stdout}`);
//       }
//     );
//   }
// );


const { exec } = require("child_process");

// Start the Hardhat node in the background
const hardhatNode = exec(
  "npx hardhat node --config ./SmartContract/hardhat.config.js"
);

hardhatNode.stdout.on("data", (data) => {
  console.log(`Hardhat node output: ${data}`);

  // Check for a message that indicates the node is ready
  if (data.includes("Hardhat Network started")) {
    // Deploy the smart contract once the node is up
    exec(
      "npx hardhat run ./scripts/deploy.js --network localhost",
      (err, stdout, stderr) => {
        if (err) {
          console.error(`Error deploying contract: ${err.message}`);
          return;
        }
        console.log(`Deployment output: ${stdout}`);
      }
    );
  }
});

hardhatNode.stderr.on("data", (data) => {
  console.error(`Hardhat node error: ${data}`);
});

hardhatNode.on("close", (code) => {
  console.log(`Hardhat node process exited with code ${code}`);
});

