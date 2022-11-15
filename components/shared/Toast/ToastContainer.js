import React, { Component } from 'react';
import ToastItem from './ToastItem';


const default_duration = 2000
class ToastContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowMask: false,
            currentToast: {}
        };
    }

    pushToast = (toastProps) => {
        const { type, text, duration, borderColor, isShowMask = false } = toastProps;
        let lastDuration = duration || default_duration
        this.setState({
            currentToast: {
                id: getUuid(),
                type,
                text,
                duration: lastDuration,
                isShowMask,
                borderColor
            }
        });
    }

    popToast = () => {
        this.setState({
            currentToast: {},
            isShowMask: false
        }, () => {
        });
    }

    render() {
        const { isShowMask, currentToast } = this.state;
        return (
            <div style={{
                margin: 0,
                padding: 0
            }}>
                {isShowMask && <div style={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 200
                }} />}
                <div style={{
                    position: 'fixed',
                    left: '50%',
                    top: '40%',
                    transform: 'translateX(-50%)',
                    maxWidth: '80%',
                    zIndex: '9999999'
                }}>
                    {currentToast.text && <ToastItem onClose={this.popToast} {...currentToast} />}
                </div>
            </div>
        );
    }
}

let toastCount = 0;


const getUuid = () => {
    return 'toast-container' + new Date().getTime() + '-' + toastCount++;
};

export default ToastContainer;
