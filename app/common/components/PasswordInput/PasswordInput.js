import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '../Icon';

const Wrapper = styled.div`
  width:${({width}) => width || '220px'};
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
  outline: none;
  &:focus {
    border: solid 1px ${({theme, error}) => error ? theme.destructive600 : theme.primary900};
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  font-weight: 900;
  line-height: 1.67;
  color: ${({theme}) => theme.destructive600};
  position:absolute;
  bottom:${({title}) => title ? '-27px' : '10px'};
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
  const { name, width, title, onChange, onInputTypeChange, value, isDisabled, isValid, error, ...rest } = props;
  const [type, setType] = React.useState('password');
  const eyeIconColor = type === 'password' ? 'gray400' : 'gray800';

  const toggleType = () => {
    onInputTypeChange && onInputTypeChange();
    if (type === 'password') {
      setType('text');
    }
    else {
      setType('password');
    }
  };

  return (
    <Wrapper width={width}>
      {title && <Label htmlFor={name}>{title}</Label>}
      <TextField id={name} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled} {...rest} error={error} />
      <IconWrapper onClick={toggleType} title={title}>
        {isValid ? (
          <Icon name={'check'} fontSize={'20px'} color={'accent2400'} />
        ) : (
          <Icon name={'eye'} fontSize={'20px'} color={eyeIconColor} />
        )}
      </IconWrapper>

      {error && (<ErrorMessage title={title}>{error}</ErrorMessage>)}
    </Wrapper>
  );
};

PasswordInput.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.string,
  onChange: PropTypes.func,
  onInputTypeChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
  isDisabled: PropTypes.bool,
  isValid: PropTypes.bool,
  error: PropTypes.string,
};

export default PasswordInput;
