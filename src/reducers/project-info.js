const SET_PROJECT = 'scratch-gui/projectInfo/SET_PROJECT';

/**
 * 全局的作品项目配置
 */

const initialState = {
    id: '0',
    name: '未命名',
    userToken: null,
    description: null,
    classId: null,
    type: null,
    isLoading: false, // 是否正在上传
    loadStatus: 0 // 上传的状态,0:预处理,1:提交中,2:解析中
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PROJECT:{
        return Object.assign({}, state, action.project);
    }
    default:
        return state;
    }
};

const setProject = function (data) {
    return {
        type: SET_PROJECT,
        project: data
    };
};


export {
    reducer as default,
    initialState as projectInfoInitialState,
    setProject
};
