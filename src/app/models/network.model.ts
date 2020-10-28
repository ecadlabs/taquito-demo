export interface Network {
  type: NetworkType;
  name?: string;
  rpcUrl?: string;
}

export enum NetworkType {
  MAINNET = 'mainnet',
  CARTHAGENET = 'carthagenet',
  DELPHINET = 'delphinet',
  CUSTOM = 'custom',
}

export namespace Network {
  export function values(): string[] {
    return Object.values(NetworkType).filter(
      (value) => typeof value === 'string'
    ) as string[];
  }

  export function getUrl(network: NetworkType): string {
    return getNetwork(network).rpcUrl;
  }

  // TODO put the type back (Network) when Delphinet will be added to the enum NetworkType of beacon-sdk
  export function getNetwork(network: NetworkType): any {
    return {
      [NetworkType.MAINNET]: {
        type: NetworkType.MAINNET,
        name: 'Mainnet',
        rpcUrl: 'https://api.tez.ie/rpc/mainnet',
      },
      [NetworkType.CARTHAGENET]: {
        type: NetworkType.CARTHAGENET,
        name: 'Carthagenet',
        rpcUrl: 'https://api.tez.ie/rpc/carthagenet',
      },
      [NetworkType.DELPHINET]: {
        type: NetworkType.DELPHINET,
        name: 'Delphinet',
        rpcUrl: 'https://api.tez.ie/rpc/delphinet',
      },
    }[network];
  }
}
