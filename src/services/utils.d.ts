import { ValidatorType } from "brewit";
import { Account, Address, Hex } from "viem";

export function encodeValidationData(params: {
    threshold: number;
    owners: Address[];
}): Hex;

export function getValidatotConfig(address: Hex, salt: Hex): {
    validator: ValidatorType;
    validatorInitData: Hex;
    salt: Hex;
};

export function getSignerInfo(): {
    signer: Account|null;
    salt: Hex;
};
