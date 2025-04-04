declare module 'aptos' {
  export class AptosClient {
    constructor(endpoint: string);
    getAccountResources(address: string): Promise<any[]>;
    // Add other methods as needed
  }

  export namespace Types {
    export type EntryFunctionPayload = {
      function: string;
      type_arguments: string[];
      arguments: any[];
    };

    export type HexEncodedBytes = string;

    export type TransactionPayload = EntryFunctionPayload;
  }

  export namespace TxnBuilderTypes {
    // Add types as needed
  }
} 