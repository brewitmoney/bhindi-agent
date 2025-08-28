import { ValidatorType } from "brewit"
import { Account, Address, encodeAbiParameters, Hex } from "viem"
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts"
import fs from 'fs';
// import path from 'path';

const CONFIG_PATH = new URL('../config/signer.json', import.meta.url).pathname;



export const encodeValidationData = ({
    threshold,
    owners,
  }: {
    threshold: number
    owners: Address[]
  }) => {
    return encodeAbiParameters(
      [
        {
          type: 'uint256',
        },
        {
          type: 'address[]',
        },
      ],
      [BigInt(threshold), owners.sort()],
    )
  }



  export const getValidatotConfig = (address: Hex, salt: Hex): {
  validator: ValidatorType;
  validatorInitData: Hex;
  salt: Hex;
} => {
   const validatorConfig = { validator: 'ownable' as ValidatorType, 
    validatorInitData: encodeValidationData({
        threshold: 1,
        owners: [address],
      }), 
    salt: salt
  }
  return validatorConfig;
}


export function getSignerInfo(): {  signer: Account|null, salt: Hex} {
    let config: any = {};
    let signer: Account|null = null;
    let salt: Hex = '0x';
    
    // First check config file
    if (fs.existsSync(CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      if (config.privateKey) {
        signer = privateKeyToAccount(config.privateKey);
      }
    }
    
    // If no private key in config, check environment variable
    if (!signer && process.env.AGENT_PRIVATE_KEY) {
      signer = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY as Hex);
      // Store the env private key in config for future use
      config.privateKey = process.env.AGENT_PRIVATE_KEY;
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    }
    
    // If still no private key, generate one and store in config
    if (!signer) {
      const privateKey = generatePrivateKey();
      config.privateKey = privateKey;
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
      signer = privateKeyToAccount(privateKey);
    }
    
    // Get salt from config file
    if (fs.existsSync(CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      if (config.salt) {
        salt = config.salt;
      }
    }
    
    return {signer, salt};
  }