import { Router, Request, Response } from 'express';
import { getSignerInfo, getValidatotConfig } from '../services/utils';
import { createMainAccount } from '../services/executer/utils/account';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const {signer, salt} = getSignerInfo();
    const account = await createMainAccount(signer, 'ownable', 8453);
    
    if (!signer) {
      res.status(500).json({
        success: false,
        error: 'Account not found'
      });
      return;
    }

    res.json({
      success: true,
      signer: signer.address,
      address: account.address,
      publicKey: signer.publicKey,
      validatorConfig: getValidatotConfig(signer.address, salt),
    });
  } catch (error: Error | unknown) {
    res.status(500).json({
      success: false,
      error: 'Failed to get account info',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router; 
