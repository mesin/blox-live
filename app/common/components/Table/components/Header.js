import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  padding: 0px 20px;
  display: flex;
  border-bottom: solid 1px ${({ theme }) => theme.gray300};
  font-size: 12px;
`;

const Cell = styled.div`
  width: ${({ width }) => width};
  height: 100%;
  display: flex;
  align-items: center;
`;

const Header = ({ columns }) => (
  <Wrapper>
    {columns.map((column) => {
      const { key, title, width } = column;
      return (
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
