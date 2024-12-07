import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

const GlobalStyle = createGlobalStyle`
    ${reset}
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #root{
        display:flex;
        justify-content: center;
    }

    body {
        font-family: 'Noto Sans KR', Roboto, sans-serif;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        border: none;
        color:inherit;
        background-color: transparent;
        cursor: pointer;
    }

    input {
        outline: none;
        color:inherit;
    }

`;

export default GlobalStyle;
