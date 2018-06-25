const SET_WORK = 'scratch-gui/Scratch/SET_WORK';


const initialState = {
    work:{
        id: null,
        platFormId: null,
        name: "未命名",
        userToken: null,
        chapterId: null,
        description: null,
        homeworkId: null,
        classId: null,
        type: null
    }
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_WORK:{
            return Object.assign({}, state, {
                work: action.work
            });
        }
        default:
            return state;
    }
};

const setWork = function (work) {
    return {
        type: SET_WORK,
        work: work
    };
};


export {
    reducer as default,
    initialState as scratchInitialState,
    setWork
};
