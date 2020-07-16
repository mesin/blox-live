import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Spinner } from '../../../../../common/components';

const Wrapper = styled.div`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  margin-top: 34px;
  border-radius: 7px;
  position: relative;
  background-color: #ffffff;
  display: flex;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  background-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.gray5050 : '#ffffff'};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

const BorderPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  border-radius: 7px;
  transition: all 0.5s;
  box-shadow: ${({ theme, isDisabled }) =>
    isDisabled
      ? `${theme.gray600} inset 0px 0px 0px 1px`
      : `${theme.primary900} inset 0px 0px 0px 2px`};
  &:hover {
    box-shadow: ${({ theme, isDisabled }) =>
      isDisabled
        ? `${theme.gray600} inset 0px 0px 0px 1px`
        : `${theme.primary900} inset 0px 0px 0px 4px`};
    ${({ isDisabled }) =>
      !isDisabled &&
      `
        & ~ .nextButtonIconWrapper {
        padding-right:22px;
      }
    `}
  }
`;

const Sticker = styled.div`
  height: 20px;
  padding: 0px 7px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.gray50};
  background-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.gray400 : theme.accent2600};
  border-top-right-radius: 7px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 4;
`;

const ImageWrapper = styled.div`
  width: 157px;
  height: calc(100% - 4px);
  margin: 2px 0px 0px 2px;
  background-color: ${({ theme }) => theme.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const TextWrapper = styled.div`
  width: 230px;
  padding: 0px 22px 0px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const TitleText = styled.span`
  color: ${({ theme }) => theme.gray800};
  font-size: 16px;
  font-weight: 500;
`;

const SubTitleText = styled.span`
  color: ${({ theme }) => theme.gray800};
  font-size: 20px;
  font-weight: 900;
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 36px;
  transition: all 0.5s;
`;

const ButtonWithIcon = (props) => {
  const {
    width,
    height,
    sticker,
    title,
    subTitle,
    image,
    onClick,
    isDisabled,
    isLoading,
  } = props;
  const IconName = isDisabled ? 'lock' : 'arrow-forward';
  const IconColor = isDisabled ? 'gray400' : 'primary900';
  return (
    <Wrapper
      width={width}
      height={height}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      <BorderPlaceholder isDisabled={isDisabled} />
      {sticker && <Sticker isDisabled={isDisabled}>{sticker}</Sticker>}
      {image && (
        <ImageWrapper>
          <Image src={image} />
        </ImageWrapper>
      )}
      <TextWrapper>
        <TitleText>{title}</TitleText>
        {subTitle && <SubTitleText>{subTitle}</SubTitleText>}
      </TextWrapper>
      <IconWrapper className="nextButtonIconWrapper">
        {isLoading ? (
          <Spinner />
        ) : (
          <Icon
            name={IconName}
            fontSize="24px"
            color={IconColor}
            isDisabled={isDisabled}
          />
        )}
      </IconWrapper>
    </Wrapper>
  );
};

ButtonWithIcon.defaultProps = {
  isLoading: false,
  isDisabled: false,
  width: '450px',
  height: '130px',
};

ButtonWithIcon.propTypes = {
  isLoading: PropTypes.bool,
  sticker: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default ButtonWithIcon;
