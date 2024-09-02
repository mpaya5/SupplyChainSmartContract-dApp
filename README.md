# SupplyChainSmartContract-dApp

```
apology = "Proyect not finished yet.\n"
print(apology)
/*
Scroll to the end to see what's missing. 
*/

```
This project is focused on creating a "Supply Chain App," which essentially serves as a framework to connect producers and consumers while managing products and services throughout their journey.

## Why Use Blockchain Technology?

We aim to reduce the cost of intermediaries and provide transparency and visibility in the supply chain. But what are intermediaries? They are the middlemen who exist between the producer and the consumer.

## How Do We Achieve This?

To accomplish this, we need to store four types of data:

- **ASSETS**: An asset is a product that can be purchased by the consumer.
- **PARTICIPANTS**: Participants are all the entities involved in the supply chain. These can include manufacturers, suppliers, vendors, and consumers.
- **OWNERSHIP**: Assets are "moved" by participants. To associate an asset with a participant, we need to manage its ownership. An ownership structure determines which participant currently owns a product or when it was owned by a particular participant. This provides the ability to track a product over time.
- **TOKEN**: A token allows us to define the data for how participants pay each other.

We also need to define the functions of the token that we will use within our application:

- **Initialize Tokens**: When we first create our supply chain, we want to initialize a pool of tokens for payments.
- **Transfer Tokens**: This function allows us to transfer tokens between participants.
- **Authorize Token Payments**: This enables token transfers on behalf of a participant.

To bring our Supply Chain App to life, we need to implement several functions:

- Add and update participants.
- Move products along the supply chain.
  - Transfer product ownership.
- Add and update products.
- Track an asset.
  - Determine where a product is today.
  - Find product provenance (ownership history).

## Testing

I have tested the application using `truffle console` along with Ganache, and the results from the [dirtyTest file in the test folder](https://github.com/yumewebs/SupplyChainSmartContract-dApp/blob/main/test/dirtyTest.txt) were positive, with no errors encountered.

## Deployment

I have modified the `truffle-config.js` file and configured it for deploying contracts to both the Mainnet and Ropsten using [Infura](https://infura.io) to establish the connection.

The only remaining issue is solving an error during the contract deployment:
```1_initial_migration.js
1_initial_migration.js
Deploying 'Migrations'
transaction hash: 0x70ee57fdbae0d63c3b986ad339b8aae8c1b8974a4fec8e038c5858370b88753f *** Deployment Failed ***

"Migrations" -- Transaction was not mined within 750 seconds, please make sure your transaction was properly sent. Be aware that it might still be mined! -- Reason given: Custom error (could not decode)..

Exiting: Review successful transactions manually by checking the transaction hashes above on Etherscan.

Error: *** Deployment Failed ***

"Migrations" -- Transaction was not mined within 750 seconds, please make sure your transaction was properly sent. Be aware that it might still be mined! -- Reason given: Custom error (could not decode)..
```

*Once this issue is resolved, I will test the application on Ropsten and provide the transaction hashes here for reference.*
This version is more concise and clear, ensuring that the reader understands the project's purpose, progress, and current challenges.
