import { Request, Response } from 'express';
import { FetchError } from 'node-fetch';
import { ContractMismatchError, UnsupportedNetwork } from '../base';
import { RESPONSE_TIMEOUT } from '../config';
 const Domain = require('../models/nameRegistered');


/* istanbul ignore next */
export async function queryName(req: Request, res: Response) {
 
  res.setTimeout(RESPONSE_TIMEOUT, () => {
    res.status(504).json({ message: 'Timeout' });
  });
//   /:networkName/:domainType/:walletAddress
  const { networkName,domainType,name } = req.params;
 
  try {
   const result =  await Domain.count({"args_name":name})
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
