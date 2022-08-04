interface IAction {
  type: string;
  payload?: any;
}

interface ILaunchPadCollection {
  Id: number;
  AdminId: number;
  CollectionName: string;
  CollectionSymbol: string;
  Description?: string;
  ExternalUrl?: string;
  ImageUrl?: string;
  Category: string;
  ContractAddress: string;
  Price: number;
  Quantity: number;
  MaxPerWallet: number;
  SuperAdminAddress: string;
  SuperAdminPercent: number;
  RoyaltyAddresses: string[];
  RoyaltyPercents: number[];
  CreatedAt: Date;
  ChainId: number;
}
