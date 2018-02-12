var CodeChallenge = artifacts.require("./CodeChallenge.sol");

module.exports = function(deployer) {
  deployer.deploy(CodeChallenge);
};
