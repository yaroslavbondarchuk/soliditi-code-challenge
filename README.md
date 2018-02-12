#Prerequisite
Truffle
https://github.com/trufflesuite/truffle

Ganache 
http://truffleframework.com/docs/ganache/using

Oraclize bridge
https://github.com/oraclize/ethereum-bridge#active-mode

#Testing
1.Run ganache app with UI
2.Run Oraclize bridge
>node bridge -H 127.0.0.1:7545 -a 9 --dev --skip

Sometimes it is needed to restart bridge several times

3.Change dir to the project
>truffle test

