import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width:200px;
  height:70px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
`;

const Label = styled.label``;

const TextField = styled.input`
  width: 230px;
  height: 36px;
  color:${({theme, disabled}) => disabled ? theme.gray400 : theme.gray600};
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  border: solid 1px ${({theme}) => theme.gray300};
  padding:8px 12px;
`;

const TextInput = (props) => {
  const { name, title, onChange, type, value, isDisabled } = props;
  return (
    <Wrapper>
      <Label htmlFor={name}>{title}</Label>
      <TextField id={name} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled} />
    </Wrapper>
  );
};

TextInput.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default TextInput;
