import React from 'react';
import styled from 'styled-components';
import Organization from './Organization';
import NumberOfValidators from './NumberOfValidators';

const Wrapper = styled.div`
  width: 85%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 35px;
`;

const OrganizationAndValidators = ({ numOfValidators, orgProps }: Props) => (
  <Wrapper>
    <Organization orgProps={orgProps} />
    <NumberOfValidators numOfValidators={numOfValidators} />
  </Wrapper>
);

type Props = {
  numOfValidators?: number;
  orgProps: OrgProps;
};

type OrgProps = {
  isLoading: boolean;
  isEditing: boolean;
  name: string;
  joinDate: string;
  onChange: (event: Record<string, any>) => void;
  onClick: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default OrganizationAndValidators;
