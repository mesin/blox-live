import React from 'react';
import PropTypes from 'prop-types';
import Text from './Text';

const ContentManager = ({page}) => {
  switch (page) {
    case 1:
      return (
        <>
          <Text>Page 1</Text>
        </>
      );
    case 2:
      return (
        <>
          <Text>Page 2</Text>
        </>
      );
    case 3:
      return (
        <>
          <Text>Page 3</Text>
        </>
      );
    case 4:
      return (
        <>
          <Text>Page 4</Text>
        </>
      );
    case 5:
      return (
        <>
          <Text>Page 5</Text>
        </>
      );
    case 6:
      return (
        <>
          <Text>Page 6</Text>
        </>
      );
  }
};

ContentManager.propTypes = {
  page: PropTypes.number,
};

export default ContentManager;
