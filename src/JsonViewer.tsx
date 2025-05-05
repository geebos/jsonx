import {JsonViewerItemDiv, JsonViewerKeyDiv, JsonViewerKeySpan, GlobalStyle} from './JsonViewer.styled';

type JsonType = object | number | string | boolean | null

function JsonViewerItem(prop: { path: string, name: string, value: JsonType }) {
  if (typeof prop.value != 'object' || prop.value === null) {
    return (
        <JsonViewerItemDiv>
          <JsonViewerKeyDiv>
            <JsonViewerKeySpan>{prop.name}</JsonViewerKeySpan>
            <span className={typeof prop.value}>{prop.value?.toString()}</span>
          </JsonViewerKeyDiv>
        </JsonViewerItemDiv>
    );
  }

  let kvs: { key: string; val: JsonType }[];
  if (Array.isArray(prop.value)) {
    kvs = prop.value.map((item, index) => ({key: `${index}`, val: item}));
  } else {
    const obj = (Object)(prop.value);
    kvs = Object.keys(obj).map((key) => ({key, val: obj[key]}));
  }
  // TODO: do sort here
  return (
      <JsonViewerItemDiv style={{flexDirection: 'column'}}>
        <JsonViewerKeyDiv>
          <JsonViewerKeySpan>{prop.name}</JsonViewerKeySpan>
        </JsonViewerKeyDiv>
        {kvs.map((item) => <JsonViewerItem path={`${prop.path}.${prop.name}`} name={`${item.key}`} value={item.val}/>)}
      </JsonViewerItemDiv>
  );
}

function JsonViewer(prop: { json: JsonType }) {
  return <>
    <GlobalStyle></GlobalStyle>
    <JsonViewerItem path={`"$"`} name={'JSON'} value={prop.json}/>
  </>;
}

export default JsonViewer;