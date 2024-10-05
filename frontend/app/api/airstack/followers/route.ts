import { fetchQuery, init } from "@airstack/node";

if (!process.env.AIRSTACK_TOKEN) throw new Error("AIRSTACK_TOKEN is not set in environment variables");

init(process.env.AIRSTACK_TOKEN);

const getSocialFollowersQuery = `query GetSocial($identity: Identity!) {
  SocialFollowers(input: {filter: {identity: {_eq: $identity}}, blockchain: ALL}) {
    Follower {
      dappName
      dappSlug
      followerAddress {
        identity
        addresses
        domains {
          isPrimary
          name
          resolvedAddress
        }
        socials {
          dappName
          profileName
          profileImage
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
    }
  }
}
`;

export interface GetFollowersResponse {
  Follower: {
    dappName: string;
    dappSlug: string;
    followerAddress: {
      identity: string;
      addresses: string[];
      socials: {
        dappName: string;
        profileName: string;
        profileImage: string;
        profileTokenId: string;
        profileTokenIdHex: string;
        userId: string;
        userAssociatedAddresses: string[];
      }[];
      domains: {
        isPrimary: boolean;
        name: string;
      }[];
    };
  }[];
}

export interface FollowerStructure {
  dappName: string;
  dappSlug: string;
  followerAddress: {
    identity: string;
    addresses: string[];
    socials: {
      profileName: string;
      profileTokenId: string;
      profileTokenIdHex: string;
      userId: string;
      userAssociatedAddresses: string[];
    }[];
    domains: {
      isPrimary: boolean;
      name: string;
    }[];
  };
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const res = await fetchQuery(getSocialFollowersQuery, { identity: searchParams.get("address") });
  return Response.json({ data: res.data.SocialFollowers });
};
