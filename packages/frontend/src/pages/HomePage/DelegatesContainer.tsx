import { usePaginationFragment } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { css } from "@emotion/css";
import * as theme from "../../theme";
import { VoterCard } from "./VoterCard";
import { DelegatesContainerFragment$key } from "./__generated__/DelegatesContainerFragment.graphql";
import { VStack } from "../../components/VStack";

type Props = {
  fragmentKey: DelegatesContainerFragment$key;
};

export function DelegatesContainer({ fragmentKey }: Props) {
  const {
    data: { voters },
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment(
    graphql`
      fragment DelegatesContainerFragment on Query
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 30 }
        after: { type: "String" }
      )
      @refetchable(queryName: "DelegatesContainerPaginationQuery") {
        voters: wrappedDelegates(first: $first, after: $after)
          @connection(key: "DelegatesContainerFragment_voters") {
          edges {
            node {
              id
              ...VoterCardFragment
            }
          }
        }
      }
    `,
    fragmentKey
  );

  return (
    <VStack
      alignItems="center"
      className={css`
        width: 100%;
        max-width: ${theme.maxWidth["6xl"]};
        padding-top: ${theme.spacing["16"]};
        padding-bottom: ${theme.spacing["16"]};
        /* padding-left: ${theme.spacing["4"]}; */
        /* padding-right: ${theme.spacing["4"]}; */
      `}
    >
      <VStack
        className={css`
          width: 100%;
          margin-bottom: ${theme.spacing["8"]};
        `}
      >
        <h2
          className={css`
            font-size: ${theme.fontSize["2xl"]};
            font-weight: bolder;
          `}
        >
          Voters
        </h2>
      </VStack>

      <div
        className={css`
          display: grid;
          grid-template-columns: repeat(3, calc(${theme.spacing["12"]} * 7.55));
          gap: ${theme.spacing["8"]};
          width: 100%;
          /* max-width: ${theme.maxWidth["6xl"]}; */
        `}
      >
        {voters.edges.map(({ node: voter }) => (
          <VoterCard key={voter.id} fragmentRef={voter} />
        ))}

        {isLoadingNext && <div>loading</div>}
        {hasNext && <button onClick={() => loadNext(30)}>Load More!</button>}
      </div>
    </VStack>
  );
}
