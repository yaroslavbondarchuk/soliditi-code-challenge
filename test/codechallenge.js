// Specifically request an abstraction for CodeChallenge
var codeChallenge = artifacts.require("CodeChallenge");
var sleepTimeInMillis = 30000;
function enableCondition() {
    httpGet("http://test-blockchain.getsandbox.com/state/on");
}

function disableCondition() {
    httpGet("http://test-blockchain.getsandbox.com/state/off");
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

contract('CodeChallenge', async function (accounts) {

    it("Eth wasn't transferred", async function () {
        disableCondition();

        // Get initial balances of the second and third account.
        var account_two = accounts[1];
        var account_two_starting_balance = web3.fromWei(web3.eth.getBalance(account_two), "ether").toNumber();
        var account_three = accounts[2];
        var account_three_starting_balance = web3.fromWei(web3.eth.getBalance(account_three), "ether").toNumber();

        var amount = 2;

        let challenge = await codeChallenge.deployed();

        await challenge.executeTransfer(account_three, {from: account_two, value: web3.toWei(amount, "ether")});

        await sleep(sleepTimeInMillis);

        var account_two_ending_balance = web3.fromWei(web3.eth.getBalance(account_two), "ether").toNumber();
        assert(account_two_starting_balance <= account_two_ending_balance + amount, "Gas should be spent and eth shouldn't be transferred");

        account_three_ending_balance = web3.fromWei(web3.eth.getBalance(account_three), "ether").toNumber();
        assert.equal(account_three_starting_balance, account_three_ending_balance, "Eth shouldn't be earned");

    });

});

contract('CodeChallenge', async function (accounts) {

    it("Contract wasn't signed", async function () {
        disableCondition();
        var account_seven = accounts[6];
        var amount = 1;

        let challenge = await codeChallenge.deployed();

        var account_seven_starting_balance = web3.fromWei(web3.eth.getBalance(account_seven), "ether").toNumber();

        await challenge.signContract({from: account_seven, value: web3.toWei(amount, "ether")});

        await sleep(sleepTimeInMillis);

        var account_seven_ending_balance = web3.fromWei(web3.eth.getBalance(account_seven), "ether").toNumber();
        assert(account_seven_starting_balance <= (account_seven_ending_balance + amount), "Eth should be refunded");

    });

});

contract('CodeChallenge', async function (accounts) {

    it("Contract was signed", async function () {
        enableCondition();

        var account_eight = accounts[7];
        var amount = 1;

        let challenge = await codeChallenge.deployed();

        var account_eight_starting_balance = web3.fromWei(web3.eth.getBalance(account_eight), "ether").toNumber();

        await challenge.signContract({from: account_eight, value: web3.toWei(amount, "ether")});

        await sleep(sleepTimeInMillis);

        var account_eight_ending_balance = web3.fromWei(web3.eth.getBalance(account_eight), "ether").toNumber();
        assert(account_eight_starting_balance >= (account_eight_ending_balance + amount), "Eth should be spent");

    });

});

contract('CodeChallenge', async function (accounts) {


    it("Eth was transferred", async function () {
        enableCondition();

        // Get initial balances of the second and third account.
        var account_four = accounts[3];
        var account_four_starting_balance = web3.fromWei(web3.eth.getBalance(account_four), "ether").toNumber();
        var account_five = accounts[4];
        var account_five_starting_balance = web3.fromWei(web3.eth.getBalance(account_five), "ether").toNumber();

        var amount = 2;

        let challenge = await codeChallenge.deployed();

        await challenge.executeTransfer(account_five, {from: account_four, value: web3.toWei(amount, "ether")});

        await sleep(sleepTimeInMillis);

        var account_four_ending_balance = web3.fromWei(web3.eth.getBalance(account_four), "ether").toNumber();
        assert(account_four_starting_balance >= account_four_ending_balance + amount, "Gas should be spent and eth should be transferred");

        var account_five_ending_balance = web3.fromWei(web3.eth.getBalance(account_five), "ether").toNumber();
        assert.equal(account_five_starting_balance,account_five_ending_balance - amount, "Eth should be earned");

    });


});

