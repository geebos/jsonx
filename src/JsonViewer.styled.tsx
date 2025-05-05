import styled from 'styled-components';
import {createGlobalStyle} from 'styled-components';

const JsonViewerKeyDiv = styled.div`
    position: relative;
    height: fit-content;
    margin-left: 15px;
    padding: 3px 8px;
    border-radius: 4px;
    cursor: default;

    &:hover {
        font-weight: 600;
    }

    &::before {
        content: '';
        position: absolute;
        left: -15px;
        top: calc(50%);
        width: 15px;
        border-top: 1px dashed #ccc;
    }
`;

const JsonViewerKeySpan = styled.span`
    font-weight: 600;
    
    &::after {
        content: ':';
        font-weight: 600;
    }
`;

const JsonViewerItemDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0;
    margin-left: 15px;
    border-left: 1px dashed #ccc;
    cursor: row-resize;
`;

const GlobalStyle = createGlobalStyle`
    * {
        font-family: Tahoma, serif;
    }

    #root > ${JsonViewerItemDiv} {
        border: none;
    }

    ${JsonViewerItemDiv} > ${JsonViewerItemDiv}:last-child {
        border: none;

        > ${JsonViewerKeyDiv}:first-child {
            margin-left: 18px;

            &::after {
                content: '';
                position: absolute;
                top: 0;
                left: -18px;
                height: calc(50% + 1px);
                border-left: 1px dashed #ccc;
            }
        }
    }
`;

export {
  JsonViewerItemDiv,
  JsonViewerKeyDiv,
  JsonViewerKeySpan,
  GlobalStyle,
};