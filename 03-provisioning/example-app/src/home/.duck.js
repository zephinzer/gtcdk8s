import {createActions, createReducer} from 'reduxsauce';

const {
  Creators,
  Types,
} = createActions({
  // api calls
  createNewPost: ['post'],
  deletePostWithId: ['postId'],
  getAllPosts: ['posts'],
  getPostWithId: ['postId'],
  updatePostWithId: ['postId', 'postContent'],
  // local states
  setPostContent: ['postContent'],
  editPostContent: ['postId'],
  updatePostContent: ['postId', 'postContent'],
});

export const actions = {
  ...Creators,
  createNewPost: (text) => {
    return (dispatch) => {
      fetch(`${global.app.apiUrl}/post`, {
        body: JSON.stringify({
          content: text,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((json) => {
        fetch(`${global.app.apiUrl}/post/${json}`)
          .then((response) => response.json())
          .then((post) => {
            dispatch(Creators.createNewPost(post));
          });
      });
    };
  },
  deletePostWithId: (postId) => {
    return (dispatch) => {
      fetch(`${global.app.apiUrl}/post/${postId}`, {
        method: 'DELETE'
      })
      .then((response) => response.json())
      .then((successfullyDeleted) => {
        if (successfullyDeleted) {
          dispatch(Creators.deletePostWithId(postId));
        } else {
          alert('it didnt work out');
        }
      });
    };
  },
  updatePostWithId: (postId, postContent) => {
    return (dispatch) => {
      fetch(`${global.app.apiUrl}/post/${postId}`, {
        body: JSON.stringify({
          content: postContent
        }),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((successfullyUpdated) => {
        if (successfullyUpdated) {
          dispatch(Creators.updatePostWithId(postId, postContent));
        } else {
          alert('it didnt work out');
        }
      });
    }
  },
  getAllPosts: () => {
    return (dispatch) => {
      fetch(`${global.app.apiUrl}/posts`)
        .then((response) => response.json())
        .then((json) => {
          dispatch(Creators.getAllPosts(json));
        });
    };
  }
};
export const types = Types;
export const initialState = {
  currentPostContent: '',
  posts: [],
}; 

export const handlers = {
  [types.UPDATE_POST_CONTENT]: (i = intiialState, action) => {
    console.info('UPDATE_POST_CONTENT -', action.postId, '-', action.postContent);
    const newState = {
      ...i,
    };
    newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].content = action.postContent;
    return newState;
  },
  [types.EDIT_POST_CONTENT]: (i = initialState, action) => {
    console.info('EDIT_POST_CONTENT -', action.postId);
    const newState = {
      ...i,
    };
    if (newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].editing) {
      newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].content =
        newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].previousContent;
      delete newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].previousContent;
    } else {
      newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].previousContent =
        newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].content;
    }
    newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].editing =
      !newState.posts[newState.posts.findIndex((post) => post.id === action.postId)].editing;
    return newState;
  },
  [types.SET_POST_CONTENT]: (i = initialState, action) => {
    console.info('SET_POST_CONTENT -', action.postContent);
    return {
      ...i,
      currentPostContent: action.postContent,
    };
  },
  [types.CREATE_NEW_POST]: (i = initialState, action) => {
    console.info('CREATE_NEW_POST -', action.post);
    const newState = {
      ...i,
      currentPostContent: '',
    };
    newState.posts.unshift(action.post);
    return newState;
  },
  [types.DELETE_POST_WITH_ID]: (i = initialState, action) => {
    console.info('DELETE_POST_WITH_ID');
    const newState = {
      ...i,
    };
    newState.posts.splice(
      newState.posts.findIndex(
        (post) => post.id === action.postId
      ), 1
    );
    return newState;
  },
  [types.GET_ALL_POSTS]: (i = initialState, action) => {
    console.info('GET_ALL_POSTS');
    return {
      ...i,
      posts: action.posts,
    };
  },
  [types.GET_POST_WITH_ID]: (i = initialState, action) => {
    console.info('GET_POST_WITH_ID');
    return {
      ...i,
    };
  },
  [types.UPDATE_POST_WITH_ID]: (i = initialState, action) => {
    console.info('UPDATE_POST_WITH_ID -', action.postId, '-', action.postContent);
    const newState = {
      ...i,
    };
    newState.posts[
      newState.posts.findIndex(
        (post) => post.id === action.postId
      )
    ].content = action.postContent;
    delete newState.posts[
      newState.posts.findIndex(
        (post) => post.id === action.postId
      )
    ].previousContent;
    delete newState.posts[
      newState.posts.findIndex(
        (post) => post.id === action.postId
      )
    ].editing;
    return newState;
  },
};

export default createReducer(initialState, handlers);
