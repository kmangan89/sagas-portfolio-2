import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import axios from 'axios';
import { takeEvery, put as dispatch } from 'redux-saga/effects';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('FETCH_PROJECTS', fetchProjects)
    yield takeEvery('FETCH_TAGS', fetchTags)
    yield takeEvery('POST_PROJECT', postProject)
    yield takeEvery('DELETE_PROJECT', deleteProject)
}

function* fetchProjects(action) {
    try {
        const getProjectsResponse = yield axios.get('/portfolio');
        yield dispatch({type: 'SET_PROJECTS', payload: getProjectsResponse.data});
    }
    catch (error) {
        console.log('error with fetching projects from the server', error);
    }
}

function* fetchTags(action) {
    try {
        const getTagsResponse = yield axios.get('/tags');
        yield dispatch({ type: 'SET_TAGS', payload: getTagsResponse.data });
    }
    catch (error) {
        console.log('error with fetching tags from the server', error);
    }
}

function* postProject(action) {
    console.log('rootSaga was hit - post', action.payload);
    try {
        yield axios.post('/portfolio', action.payload);
        alert('Success!');
        yield dispatch({ type: 'FETCH_PROJECTS', fetchProjects })
    }
    catch (error) {
        alert('Project was not posted to server');
        console.log('error with post axios request', error);
    }
}

function* deleteProject(action) {
    try {
        yield axios.delete('/portfolio/' + action.payload);
        yield dispatch({ type: 'FETCH_PROJECTS' });
    }
    catch (error) {
        console.log('error deleting', action, error);
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store projects returned from the server
const projects = (state = [], action) => {
    switch (action.type) {
        case 'SET_PROJECTS':
            return action.payload;
        default:
            return state;
    }
}

// Used to store the project tags (e.g. 'React', 'jQuery', 'Angular', 'Node.js')
const tags = (state = [], action) => {
    switch (action.type) {
        case 'SET_TAGS':
            return action.payload;
        default:
            return state;
    }
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        projects,
        tags,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));
registerServiceWorker();
