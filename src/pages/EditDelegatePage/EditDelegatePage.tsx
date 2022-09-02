import { usePrimaryAccount } from "../../components/EthersProviderProvider";
import { useLazyLoadQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import { css } from "@emotion/css";
import { EditDelegatePageQuery } from "./__generated__/EditDelegatePageQuery.graphql";
import { PageHeader } from "../../components/PageHeader";
import * as theme from "../../theme";
import { VoterPanel } from "../DelegatePage/VoterPanel";
import { PageContainer } from "../../components/PageContainer";
import { TopIssuesFormSection } from "./TopIssuesFormSection";
import {
  DelegateStatementFormSection,
  tipTextStyle,
} from "./DelegateStatementFormSection";
import { PastProposalsFormSection } from "./PastProposalsFormSection";
import { PastProposalsFormSectionProposalListFragment$key } from "./__generated__/PastProposalsFormSectionProposalListFragment.graphql";
import { OtherInfoFormSection } from "./OtherInfoFormSection";

export function EditDelegatePage() {
  const address = usePrimaryAccount();

  const query = useLazyLoadQuery<EditDelegatePageQuery>(
    graphql`
      query EditDelegatePageQuery($address: ID!) {
        account(id: $address) {
          ...PageHeaderFragment
        }

        delegate(id: $address) {
          ...VoterPanelDelegateFragment
        }

        ...PastProposalsFormSectionProposalListFragment
        ...VoterPanelQueryFragment
      }
    `,
    {
      address,
    }
  );

  if (!query.delegate) {
    return null;
  }

  return (
    <PageContainer>
      <PageHeader accountFragment={query.account} />

      <div
        className={css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: ${theme.spacing["16"]};
          margin: ${theme.spacing["16"]};
          margin-top: ${theme.spacing["8"]};
          width: 100%;
          max-width: ${theme.maxWidth["6xl"]};
        `}
      >
        <DelegateStatementForm queryFragment={query} />

        <div
          className={css`
            width: ${theme.maxWidth.sm};
          `}
        >
          {/*todo: hide delegate button*/}
          <VoterPanel delegateFragment={query.delegate} queryFragment={query} />
        </div>
      </div>
    </PageContainer>
  );
}

type DelegateStatementFormProps = {
  queryFragment: PastProposalsFormSectionProposalListFragment$key;
};

function DelegateStatementForm({ queryFragment }: DelegateStatementFormProps) {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        width: 100%;

        background: ${theme.colors.white};
        border-width: ${theme.spacing.px};
        border-color: ${theme.colors.gray["300"]};
        border-radius: ${theme.borderRadius.md};
        box-shadow: ${theme.boxShadow.md};
      `}
    >
      <DelegateStatementFormSection />
      <TopIssuesFormSection />
      <PastProposalsFormSection queryFragment={queryFragment} />
      <OtherInfoFormSection />

      <div
        className={css`
          padding: ${theme.spacing["8"]} ${theme.spacing["6"]};

          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <span className={tipTextStyle}>
          Tip: you can always come back and edit your profile at any time.
        </span>

        <button className={buttonStyles}>Submit</button>
      </div>
    </div>
  );
}

export const buttonStyles = css`
  border-radius: ${theme.borderRadius.default};
  border-width: ${theme.spacing.px};
  border-color: ${theme.colors.gray["300"]};
  cursor: pointer;
  padding: ${theme.spacing["2"]} ${theme.spacing["4"]};

  :hover {
    background: ${theme.colors.gray["200"]};
  }
`;
