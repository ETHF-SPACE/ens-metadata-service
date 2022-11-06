import { Request, Response } from 'express';
import { FetchError } from 'node-fetch';
import { ContractMismatchError, UnsupportedNetwork } from '../base';
import { RESPONSE_TIMEOUT } from '../config';
 const User = require('../models/nameRegistered');


/* istanbul ignore next */
export async function domain(req: Request, res: Response) {
  // #swagger.description = 'ENS NFT image'
  // #swagger.parameters['networkName'] = { schema: { $ref: '#/definitions/networkName' } }
  // #swagger.parameters['{}'] = { name: 'contractAddress', description: 'Contract address which stores the NFT indicated by the tokenId', type: 'string', schema: { $ref: '#/definitions/contractAddress' } }
  // #swagger.parameters['tokenId'] = { type: 'string', description: 'Labelhash(v1) /Namehash(v2) of your ENS name.\n\nMore: https://docs.ens.domains/contract-api-reference/name-processing#hashing-names', schema: { $ref: '#/definitions/tokenId' } }
  res.setTimeout(RESPONSE_TIMEOUT, () => {
    res.status(504).json({ message: 'Timeout' });
  });
//   /:networkName/:domainType/:walletAddress
  const { networkName,domainType,walletAddress } = req.params;
  console.log(networkName)
  console.log(walletAddress)
  try {
   const result =  await User.find({"args.owner":walletAddress+""},{"args.name":1,"args.expires":1,"args.label":1,"args.owner":1,"_id":0})
   console.log(result)
   res.json(result);
  
  } catch (error) {
    if (error instanceof FetchError || error instanceof ContractMismatchError) {
      /* #swagger.responses[404] = { 
           description: 'No results found' 
      } */
      res.status(404).json({
        message: error.message,
      });
      return;
    }
    /* #swagger.responses[501] = { 
           description: 'Unsupported network' 
    } */
    if (error instanceof UnsupportedNetwork) {
      res.status(501).json({
        message: error.message,
      });
      return;
    }
    /* #swagger.responses[404] = { 
           description: 'No results found' 
    } */
    if (!res.headersSent) {
      res.status(404).json({
        message: 'No results found.',
      });
    }
  }
}
