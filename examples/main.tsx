import React from 'react';
import ReactDOM from 'react-dom';
import BasicExample from './basic-example';
import NestedHeaderExample from './nested-header-example';

// 为了方便演示，暂时注释掉基础示例，展示嵌套表头示例
// ReactDOM.render(
//   <React.StrictMode>
//     <BasicExample />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <React.StrictMode>
    <NestedHeaderExample />
  </React.StrictMode>,
  document.getElementById('root')
);