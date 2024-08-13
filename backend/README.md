npm install -g truffle
npm install express mongoose bcryptjs jsonwebtoken multer web3 dotenv

### this help with the web3 error
npm i web3@1.10.0
npm install @openzeppelin/contracts



`npm install -g ganache-cli`

`ganache-cli`

# ================== truffle init ===================

## Update the truffle-config.js file

```module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};```
