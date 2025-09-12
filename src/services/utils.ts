import { ValidatorType } from "brewit"
import { Account, Address, encodeAbiParameters, Hex } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { pbkdf2Sync } from 'crypto';



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



  export const getValidatotConfig = (address: Hex, salt?: Hex): {
  validator: ValidatorType;
  validatorInitData: Hex;
  salt?: Hex;
} => {
   const validatorConfig = { validator: 'ownable' as ValidatorType, 
    validatorInitData: encodeValidationData({
        threshold: 1,
        owners: [address],
      }), 
    ...(salt && { salt: salt })
  }
  return validatorConfig;
}


export function getSignerInfo(): { signer: Account } {
    // Use deterministic key generation from master seed
    const masterSeed = process.env.AGENT_MASTER_SEED;
    if (!masterSeed) {
        throw new Error('AGENT_MASTER_SEED environment variable is required for deterministic key generation');
    }
    
    // Derive consistent private key from master seed
    const privateKey = derivePrivateKeyFromSeed(masterSeed);
    const signer = privateKeyToAccount(privateKey);
    
    return { signer };
}

/**
 * Derives a consistent private key from a master seed using PBKDF2
 */
function derivePrivateKeyFromSeed(seed: string): Hex {
    try {
        const derived = pbkdf2Sync(seed, 'agent-private-key', 100000, 32, 'sha256');
        return `0x${derived.toString('hex')}`;
    } catch (error) {
        throw new Error(`Failed to derive private key from seed: ${error}`);
    }
}

 