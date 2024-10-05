import { Share } from "./share.model";

export interface ShareRelationship {
  id: string;
  holder: Share;
  owner: Share;
  supporterNumber: string;
  heldKeyNumber: string;
}
