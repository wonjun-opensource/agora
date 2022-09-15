import { useFragment } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { css } from "@emotion/css";
import * as theme from "../../theme";
import { VoterCardFragment$key } from "./__generated__/VoterCardFragment.graphql";
import { NounResolvedName } from "../../components/NounResolvedName";
import { NounsRepresentedGrid } from "../../components/NounGrid";
import { HStack, VStack } from "../../components/VStack";
import { icons } from "../../icons/icons";
import { VoterPanelActions } from "../DelegatePage/VoterPanel";
import { VoterCardDelegateProfileImage$key } from "./__generated__/VoterCardDelegateProfileImage.graphql";
import { Link } from "../../components/HammockRouter/Link";
import useMeasure from "react-use-measure";
import { useLayoutEffect, useState } from "react";

type VoterCardProps = {
  fragmentRef: VoterCardFragment$key;
};

function useIsLaidOut() {
  const [isLaidOut, setIsLaidOut] = useState(false);
  useLayoutEffect(() => {
    setIsLaidOut(true);
  }, []);

  return isLaidOut;
}

export function VoterCard({ fragmentRef }: VoterCardProps) {
  const [statementMeasureRef, bounds] = useMeasure();
  const isLaidOut = useIsLaidOut();

  const fontSize = 16;
  const lineHeight = 1.5;
  const maxLines = Math.floor(bounds.height / (fontSize * lineHeight));

  const delegate = useFragment(
    graphql`
      fragment VoterCardFragment on WrappedDelegate {
        ...VoterPanelActionsFragment

        ...VoterCardDelegateProfileImage

        address {
          resolvedName {
            address
            name

            ...NounResolvedNameFragment
          }
        }

        statement {
          statement
          summary
        }

        delegate {
          id
          voteSummary {
            totalVotes
          }
        }
      }
    `,
    fragmentRef
  );

  return (
    <Link
      to={`/delegate/${
        delegate.address.resolvedName.name ??
        delegate.address.resolvedName.address
      }`}
      className={css`
        display: flex;
        flex-direction: column;
        visibility: ${isLaidOut ? "visible" : "hidden"};
      `}
    >
      <VStack
        gap="4"
        className={css`
          max-height: 28rem;
          height: 100%;
          padding: ${theme.spacing["6"]};
          border-radius: ${theme.spacing["3"]};
          background: ${theme.colors.white};
          border-width: ${theme.spacing.px};
          border-color: ${theme.colors.gray["300"]};
          box-shadow: ${theme.boxShadow.newDefault};
          cursor: pointer;
        `}
      >
        <VStack
          justifyContent="center"
          alignItems="center"
          className={css`
            flex: 1;
          `}
        >
          <DelegateProfileImage fragment={delegate} />
        </VStack>

        <HStack
          justifyContent="space-between"
          className={css`
            margin-top: ${theme.spacing["2"]};
          `}
        >
          <div
            className={css`
              font-weight: ${theme.fontWeight.semibold};
            `}
          >
            <NounResolvedName resolvedName={delegate.address.resolvedName} />
          </div>

          {!!delegate.delegate && (
            <div>Voted {delegate.delegate.voteSummary.totalVotes} times</div>
          )}
        </HStack>

        {!!delegate.statement?.summary && (
          <div
            ref={statementMeasureRef}
            className={css`
              display: -webkit-box;

              color: #66676b;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              line-clamp: ${maxLines};
              -webkit-line-clamp: ${maxLines};
              -webkit-box-orient: vertical;
              font-size: ${theme.fontSize.base};
              line-height: ${theme.lineHeight.normal};
            `}
          >
            {delegate.statement.summary}
          </div>
        )}

        <VoterPanelActions fragment={delegate} />
      </VStack>
    </Link>
  );
}

export function DelegateProfileImage({
  fragment,
  dense,
}: {
  fragment: VoterCardDelegateProfileImage$key;
  dense?: boolean;
}) {
  const delegate = useFragment(
    graphql`
      fragment VoterCardDelegateProfileImage on WrappedDelegate {
        delegate {
          nounsRepresented {
            id
          }

          ...NounGridFragment
        }
      }
    `,
    fragment
  );

  return !delegate.delegate ? (
    <HStack
      alignItems="center"
      className={css`
        border-radius: ${theme.borderRadius.full};
        border: 1px solid ${theme.colors.gray.eb};
        box-shadow: ${theme.boxShadow.newDefault};
        margin: ${theme.spacing["4"]} 0;
      `}
    >
      <img src={icons.anonNoun} alt={"anon noun"} />
      <div
        className={css`
          font-size: ${theme.fontSize.sm};
          font-weight: ${theme.fontWeight.semibold};
          padding: 0 ${theme.spacing["4"]};
        `}
      >
        Currently seeking delegation
      </div>
    </HStack>
  ) : !delegate.delegate.nounsRepresented.length ? (
    <VStack
      justifyContent="center"
      alignItems="center"
      className={css`
        color: #afafaf;
        min-height: 44px;
        font-size: ${theme.fontSize.sm};
        margin: 0 ${theme.spacing["10"]};
        border-radius: ${theme.borderRadius.full};
        border: 1px solid ${theme.colors.gray.eb};
        box-shadow: ${theme.boxShadow.newDefault};
        margin: ${theme.spacing["4"]} 0;
        width: 100%;
      `}
    >
      No longer has votes
    </VStack>
  ) : (
    <NounsRepresentedGrid
      rows={3}
      columns={dense ? 6 : 5}
      gap={dense ? "2" : "4"}
      imageSize={dense ? "10" : "12"}
      overflowFontSize="base"
      fragmentKey={delegate.delegate}
    />
  );
}
