import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: 'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Avenir', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }

  p,
  label {
    font-family: 'Avenir', Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  a {
    cursor:pointer;
    font-family: Avenir;
  }

  button {
    outline: none;
  }
`;

export default GlobalStyle;
