import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '../Icon';
import Spinner from '../Spinner';

const Wrapper = styled.div`
  width:220px;
  height:70px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  position:relative;
`;

const Label = styled.label``;

const TextField = styled.input`
  height: 36px;
  color:${({theme, disabled}) => disabled ? theme.gray400 : theme.gray600};
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  border: solid 1px ${({theme, error}) => error ? theme.destructive600 : theme.gray300};
  padding:8px 32px 8px 12px;
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  font-weight: 900;
  line-height: 1.67;
  color: ${({theme}) => theme.destructive600};
  position:absolute;
  bottom:${({title}) => title ? '-25px' : '12px'};
`;

const IconWrapper = styled.div`
  width:25px;
  height:35px;
  position:absolute;
  top:${({title}) => title ? '36px' : '3px'};
  right:0px;
  cursor:pointer;
  display:flex;
  align-items:center;
`;

const PasswordInput = (props) => {
  const { name, title, onChange, value, isDisabled, isValid, error, ...rest } = props;
  const [type, setType] = React.useState('password');

  const toggleType = () => {
    if (type === 'password') {
      setType('text');
    }
    else {
      setType('password');
    }
  };

  return (
    <Wrapper>
      {title && <Label htmlFor={name}>{title}</Label>}
      <TextField id={name} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled} {...rest} error={error} />
      <IconWrapper onClick={toggleType} title={title}>
        {isValid ? (
          <Icon name={'check'} fontSize={'20px'} color={'accent2400'} />
        ) : (
          <Icon name={'eye'} fontSize={'20px'} color={'gray400'} />
        )}
      </IconWrapper>

      {error && (<ErrorMessage title={title}>{error}</ErrorMessage>)}
    </Wrapper>
  );
};

PasswordInput.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
  isDisabled: PropTypes.bool,
  isValid: PropTypes.bool,
  error: PropTypes.string,
};

export default PasswordInput;
