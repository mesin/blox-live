import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Icon} from '../../index';

const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  padding: 0px 20px;
  display: flex;
  border-bottom: solid 1px ${({theme}) => theme.gray300};
  font-size: 12px;
`;

const Cell = styled.div`
  width: ${({width}) => width};
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: ${({padding_right}) => padding_right};
`;

const Header = ({columns}) => (
  <Wrapper>
    {columns.map((column) => {
      const {key, title, width, isSort} = column;
      return isSort
        ? (
          <Cell width={width} key={key}>
            {title}
            <Icon
              name={false ? 'sorting-up' : 'sorting-down'}
              color="gray800"
              fontSize="16px"
              onClick={() => false}
            />
          </Cell>
        )
        : (
          <Cell width={width} key={key}>
            {title}
          </Cell>
        );
    })}
  </Wrapper>
);

Header.propTypes = {
  columns: PropTypes.array,
};

export default Header;
