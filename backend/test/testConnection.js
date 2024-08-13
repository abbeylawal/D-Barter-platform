const Web3 = require("web3");

async function testConnection() {
  try {
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );
    const accounts = await web3.eth.getAccounts();
    console.log("Connected to Ganache:", accounts);
  } catch (error) {
    console.error("Error connecting to Ganache:", error);
  }
}

testConnection();
