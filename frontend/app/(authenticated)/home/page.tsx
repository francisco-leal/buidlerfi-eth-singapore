"use client";
import { Flex } from "@/components/shared/flex";
import { PageMessage } from "@/components/shared/page-message";
import { UserItem } from "@/components/shared/user-item";
import { useUserContext } from "@/contexts/userContext";
import { useGetSocialFollowers } from "@/hooks/useAirstackApi";
import { useBuilderFIData } from "@/hooks/useBuilderFiApi";
import { useCheckUsersExist } from "@/hooks/useUserApi";
import { tryParseBigInt } from "@/lib/utils";
import { SupervisorAccountOutlined } from "@mui/icons-material";
import { CircularProgress, Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import { useMemo, useState } from "react";

export default function Home() {
  const { address } = useUserContext();
  const builderfiData = useBuilderFIData();
  const [selectedTab, setSelectedTab] = useState("top");

  const users = useMemo(
    () =>
      [...(builderfiData.data?.shareParticipants || [])]
        .filter(user => Number(user.numberOfHolders) > 0)
        .sort((a, b) => (a.numberOfHolders > b.numberOfHolders ? -1 : 1)),
    [builderfiData]
  );

  const { data: socialFollowers, isLoading } = useGetSocialFollowers(address);
  const { data: filteredSocialFollowers } = useCheckUsersExist(
    socialFollowers?.Follower.filter(
      follower => !follower.followerAddress.addresses.some(addr => addr.toLowerCase() === address?.toLowerCase())
    ).flatMap(follower => follower.followerAddress.addresses)
  );

  return (
    <Flex component={"main"} y grow>
      <Tabs defaultValue="top" value={selectedTab} onChange={(_, val) => val && setSelectedTab(val as string)}>
        <TabList tabFlex={1} className="grid w-full grid-cols-2">
          <Tab value="top">Top</Tab>
          <Tab value="recommended">Recommended</Tab>
        </TabList>
        <TabPanel value="top">
          {users.map(user => (
            <UserItem
              address={user.owner as `0x${string}`}
              buyPrice={tryParseBigInt(user.buyPrice)}
              numberOfHolders={Number(user.numberOfHolders)}
              key={`home-${user.owner}`}
            />
          ))}
        </TabPanel>
        <TabPanel value="recommended">
          {isLoading ? (
            <Flex y grow yc xc>
              <CircularProgress />
            </Flex>
          ) : (
            <>
              {!filteredSocialFollowers || filteredSocialFollowers.length == 0 ? (
                <PageMessage
                  title="We couldn't find any connections"
                  icon={<SupervisorAccountOutlined />}
                  text="Your wallet is missing lens or farcaster profiles, or none of your connections are using Builder.fi yet"
                />
              ) : (
                filteredSocialFollowers.map(user => (
                  <UserItem address={user.wallet as `0x${string}`} key={`home-${user.wallet}`} />
                ))
              )}
            </>
          )}
        </TabPanel>
      </Tabs>
    </Flex>
  );
}