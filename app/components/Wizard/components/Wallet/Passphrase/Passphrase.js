import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'common/components';
import { Title, Paragraph, Warning, Link } from '../../common';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const BoldText = styled.span`
  font-weight:900;
  color:${({theme}) => theme.warning900};
`;

const Box = styled.div`
  width: 560px;
  height: 114px;
  background-image:url('');
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 16px;
  font-weight: 900;
  text-align: center;
  color: ${({theme}) => theme.primary900};
`;

const Passphrase = (props: Props) => {
  const { page, setPage } = props;
  const isButtonDisabled = true;

  const onClick = () => !isButtonDisabled && setPage(page + 1);

  return (
    <Wrapper>
      <Title>Select your Cloud Provider</Title>
      <Paragraph>
        Validator keys can be retrieved only with your unique mnemonic backup passphrase. <br />
        This 24-word passphrase <BoldText>must be stored safely</BoldText> to withdrawal <br />
        your funds.
      </Paragraph>
      <Warning text={'Do not share your backup passphrase with anyone.'} />
      <Box>Click to reveal passphrase</Box>
      <Link href={'/'}>Download backup passphrase</Link>
      <Button isDisabled={isButtonDisabled} onClick={onClick}>Next</Button>
    </Wrapper>
  );
};

Passphrase.propTypes = {
  page: PropTypes.number,
  setPage: PropTypes.func,
};

export default Passphrase;
