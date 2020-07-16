import { keyframes } from 'styled-components';

const contentAnimation = keyframes`
  0% {
    top:-50%;
    opacity:0;
  }
  100% {
    top:0%;
    opacity:1;
  }
`;

export default contentAnimation;
