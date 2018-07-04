/**
 * Created by ADMIN on 18/7/3.
 */
const SET_CONFIRM_BACK = 'scratch-gui/Confirm/SET_CONFIRM_BACK';
const SET_CONFIRM = 'scratch-gui/Confirm/SET_CONFIRM';
const initialState = {
    confirmConf:{
        type: 1,    // 1:简单提示,2:confirm弹窗
        message: '',    // 展示信息
        status: 1,  // 1: success, 2: error
        timeout: 3000,   // 延时关闭时间
        show: false, // 是否默认展示,
        selected: ''
    }
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_CONFIRM_BACK:{
            typeof action.func === 'function' && action.func();
            let stateCopy = state;
            stateCopy.show = false;
            return Object.assign({}, state, {
                confirmConf: stateCopy
            });
        }
        case SET_CONFIRM:{
            return Object.assign({}, state, {
                confirmConf: action.confirmConf
            });
        }
        default:
            return state;
    }
};

const setConfirmBack = function (func) {
    return {
        type: SET_CONFIRM_BACK,
        func: func
    };
};

// const setConfirmBack = function () {
//     return {
//         type: SET_CONFIRM_BACK
//     };
// };

const setConfirm = function (confirmConf) {
    return {
        type: SET_CONFIRM,
        confirmConf: confirmConf
    };
};


export {
    reducer as default,
    initialState as conformInitialState,
    setConfirmBack,
    setConfirm
};
