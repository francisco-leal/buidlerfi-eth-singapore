export interface Share {
  id: string;
  owner: `0x${string}`;
  supply: string;
  numberOfHolders: string;
  numberOfHoldings: string;
  buyPrice?: string;
  sellPrice?: string;
  tradingFeesAmount?: string;
}
