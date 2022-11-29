import React from 'react';
import ReactDom from 'react-dom';
import ToastContainer from './ToastContainer';

let toastContainerDiv;
if (typeof window !== "undefined") {
  toastContainerDiv = document.createElement('div');
  document.body.appendChild(toastContainerDiv);
}


const getToastContainerRef = () => {
  if (typeof window !== "undefined") {
    return ReactDom.render(<ToastContainer />, toastContainerDiv);
  }
};

let toastContainer = getToastContainerRef();

const destroy = () => {
  ReactDom.unmountComponentAtNode(toastContainerDiv);
  toastContainer = getToastContainerRef();
};


export default {
  info: (text, duration, borderColor, isShowMask) => (toastContainer.pushToast({ type: 'info', text, duration, borderColor, isShowMask })),
  hide: destroy
};
