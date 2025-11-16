import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

const GlobalStyle = createGlobalStyle`
    ${reset}
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background-color: ${({ theme }) => theme.colors.background.secondary};
        font-family: 'Noto Sans KR', Roboto, sans-serif;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    button {
        background-color: transparent;
        border: none;
        color:inherit;
        font-family: inherit;
        cursor: pointer;
    }

    input {
        outline: none;
        color:inherit;
    }

`;

export default GlobalStyle;
