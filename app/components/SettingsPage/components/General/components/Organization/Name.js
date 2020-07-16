import React from 'react';
import PropTypes, { func } from 'prop-types';
import styled from 'styled-components';
import { Icon } from '../../../../../../common/components';

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ActualName = styled.span`
  color: ${({ isNameEmpty, theme }) =>
    isNameEmpty ? theme.gray400 : theme.gray800};
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  margin-right: 13px;
`;

const Input = styled.input`
  height: 21px;
  border: 0px;
  background-color: ${(props) => props.theme.gray50};
  box-shadow: inset 0px -2px ${(props) => props.theme.primary600};
  outline: none;
  font-size: 14px;
  color: ${(props) => props.theme.gray800};
  caret-color: ${(props) => props.theme.primary600};
`;

const IconWrapper = styled.div`
  width: 21px;
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25%;
  margin-left: 5px;
  background-color: ${(props) => props.theme.gray200};
`;

const Name = ({
  name,
  onChange,
  onClick,
  onSave,
  onCancel,
  isEditing,
  isLoading,
}) => {
  const isNameEmpty = name === '';
  return (
    <NameWrapper>
      {isEditing ? (
        <>
          <Input type="text" onChange={onChange} value={name} autoFocus />
          <IconWrapper>
            <Icon
              name="check"
              fontSize="14px"
              color="primary900"
              onClick={onSave}
            />
          </IconWrapper>
          <IconWrapper>
            <Icon
              name="close"
              fontSize="14px"
              color="primary900"
              onClick={onCancel}
            />
          </IconWrapper>
        </>
      ) : (
        <>
          <ActualName isNameEmpty={isNameEmpty}>
            {isNameEmpty ? 'Add Name' : name}
          </ActualName>
          <Icon
            name="edit"
            fontSize="14px"
            color="primary900"
            onClick={onClick}
            isDisabled={isLoading}
          />
        </>
      )}
    </NameWrapper>
  );
};

Name.propTypes = {
  name: PropTypes.string,
  isLoading: PropTypes.bool,
  isEditing: PropTypes.bool,
  onChange: func,
  onClick: func,
  onSave: func,
  onCancel: func,
};

export default Name;
