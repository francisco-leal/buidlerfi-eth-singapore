"use client";
import { Flex } from "@/components/flex";
import { PageMessage } from "@/components/page-message";
import { useGetQuestions, usePostQuestion } from "@/hooks/useQuestionsApi";
import { SocialData } from "@/hooks/useSocialData";
import { builderFIV1Abi } from "@/lib/abi/BuidlerFiV1";
import { BASE_GOERLI_TESTNET } from "@/lib/address";
import { Chat, Lock, LockOpen } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { TextField } from "@mui/material";
import { FC, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { QuestionEntry } from "./question-entry";

interface Props {
  socialData: SocialData;
  isOwnProfile: boolean;
}

export const ChatTab: FC<Props> = ({ socialData, isOwnProfile }) => {
  const [chatValue, setChatValue] = useState<string>("");
  const { address } = useAccount();
  const { data: supporterKeys } = useContractRead({
    address: BASE_GOERLI_TESTNET,
    abi: builderFIV1Abi,
    functionName: "builderCardsBalance",
    args: [socialData.address, address!],
    enabled: !!address
  });

  const ownsKeys = supporterKeys !== undefined && supporterKeys > BigInt(0);

  const { data: questions, refetch } = useGetQuestions(socialData.address);

  const postQuestion = usePostQuestion();

  const sendQuestion = async () => {
    if (!address) return;

    await postQuestion.mutateAsync({
      questionContent: chatValue,
      questionerWallet: address,
      replierWallet: socialData.address
    });
    await refetch();
  };

  if (!ownsKeys && !isOwnProfile) {
    return (
      <PageMessage
        icon={<Lock />}
        text={`Hold at least one card to ask ${socialData.name} a question and access the answers.`}
      />
    );
  }

  if (!ownsKeys && isOwnProfile) {
    return (
      <PageMessage
        icon={<Lock />}
        text="Buy the first card to allow others to trade your cards and ask you questions."
      />
    );
  }

  if (isOwnProfile && !questions?.length) {
    return <PageMessage icon={<Chat />} text="Questions asked by holders of your cards will appear here." />;
  }

  return (
    <Flex y grow>
      <Flex y grow gap2>
        {ownsKeys && !questions?.length ? (
          <PageMessage text={`Congratulations. You can now chat with ${socialData.name}`} icon={<LockOpen />} />
        ) : (
          questions?.map(question => {
            return <QuestionEntry key={question.id} question={question} isOwnChat={isOwnProfile} refetch={refetch} />;
          })
        )}
      </Flex>
      {!isOwnProfile && (
        <Flex x gap2>
          <TextField
            value={chatValue}
            onChange={e => setChatValue(e.target.value)}
            fullWidth
            error={length > 500}
            helperText={length > 500 ? "Question is limited to 500 characters" : ""}
            placeholder={`Ask a question to ${socialData.name}`}
          />
          <Button
            disabled={chatValue.length > 500}
            className="appearance-none"
            loading={postQuestion.isLoading}
            onClick={() => sendQuestion()}
          >
            Post Question
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
