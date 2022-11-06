import { strict as assert } from 'assert';
import { Contract } from 'ethers';
import { Request, Response } from 'express';
import { FetchError } from 'node-fetch';
import { BigNumber } from 'ethers';
import {
  ContractMismatchError,
  ExpiredNameError,
  UnsupportedNetwork,
  Version,
} from '../base';
import {
  ADDRESS_ETH_REGISTRY,
  ETH_REGISTRY_ABI,
  RESPONSE_TIMEOUT,
} from '../config';
 
 
const Domain = require('../models/nameRegistered');


export async function etfMetadata(req: Request, res: Response) {
    // '/meta/:networkName/:domainType/:{tokenId}',
  res.setTimeout(RESPONSE_TIMEOUT, () => {
    res.status(504).json({ message: 'Timeout' });
  });

  const { networkName,domainType, tokenId: identifier } = req.params;
 const bakgroud = "https://gateway.pinata.cloud/ipfs/QmQ7BwMcYdCwowKC697Q1NiNFQkmvic929XgZUVYQapXVB";
 console.log(networkName);
  try {
    const labelhash =  BigNumber.from(identifier).toHexString()
    
    const domainInfo =  await  Domain.findOne({"args_label":labelhash+""},{"args_name":1,"args_expires":1,"args_owner":1,"args_label":1,"block_time":1});
    // console.log(domainInfo["block_time"])
    let result:{[key:string]:Object} = {}
    if(domainInfo){
        result['name'] = domainInfo['args_name']+".ethf";
        result['description'] = domainInfo['args_name']+".ethf, an ETHF name";
        result['background_image'] = bakgroud;
        result["url"] =  "https://etherfair.space/view?name="+domainInfo['args_name'];
        result["image"] =  bakgroud ;
        result["image_url"] =  bakgroud ;
        let attributes = [] //"trait_type":"Created Date","display_type":"date","value":1571924851000
        attributes.push({
         "trait_type" :"Created Date",
         "display_type":"date",
         "value":domainInfo["block_time"]+""
        });
        attributes.push({
          "trait_type" :"Expiration Date",
          "display_type":"date",
          "value":domainInfo["args_expires"]["value"]
         });
         attributes.push({
          "trait_type" :"Length",
          "display_type":"number",
          "value":(domainInfo["args_name"]).length
         });
         result['attributes'] =attributes;
    }
    
    
    return res.json(result);
  } catch (error: any) {
    let errCode = (error?.code && Number(error.code)) || 500;
    /* #swagger.responses[500] = { 
             description: 'Internal Server Error'
    } */
    if (
      error instanceof FetchError ||
      error instanceof ContractMismatchError ||
      error instanceof ExpiredNameError
    ) {
      if (errCode !== 404) {
        res.status(errCode).json({
          message: error.message,
        });
        return;
      }
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

  
  }
}
