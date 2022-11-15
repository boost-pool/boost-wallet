import React, { Component } from 'react';

class ToastItem extends Component {
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { id, duration, onClose, isShowMask = false } = this.props;
    this.timer = setTimeout(() => {
      if (onClose) {
        onClose(id, isShowMask);
      }
    }, duration);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  render() {
    // eslint-disable-next-line react/prop-types
    const { text } = this.props;

    // eslint-disable-next-line react/prop-types
    if (!text || (text && text.length <= 0)) {
      return <></>;
    }
    return (
      <div style={{
        padding: '8px 10px',
        background: '#1F2937',
        color: '#fff',
        borderRadius: '10px',
        marginTop: '10px',
        textAlign: 'center',
        border: ('1px solid '+this.props.borderColor),
        boxShadow: '4px 0px 15px -3px #000000'
      }}>
        {text}
      </div>
    );
  }
}

export default ToastItem;
