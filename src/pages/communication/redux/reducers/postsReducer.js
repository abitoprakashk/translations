import {PostActionType} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  postList: [],
  filteredPosts: [],
  isPostsLoading: true,
  isDeletePostModalOpen: false,
  postTitleForDelete: '',
  postToDeleteInfo: null,
}

const postListReducer = (state, {payload}) => {
  state.postList = [...payload]
  return state
}

const filteredPostsReducer = (state, {payload}) => {
  state.filteredPosts = [...payload]
  return state
}

const postListErrorReducer = (state) => {
  state.isPostsLoading = false
  return state
}

const postListRequestSucceededReducer = (state, {payload}) => {
  state.postList = payload
  state.filteredPosts = payload
  state.isPostsLoading = false
  return state
}

const isDeletePostModalOpenReducer = (state, {payload}) => {
  state.isDeletePostModalOpen = payload
  return state
}

const postTitleForDeleteReducer = (state, {payload}) => {
  state.postTitleForDelete = payload
  return state
}

const postToDeleteInfoReducer = (state, {payload}) => {
  state.postToDeleteInfo = payload
  return state
}

const postsReducer = {
  [PostActionType.POST_LIST]: postListReducer,
  [PostActionType.FILTERED_POST_LIST]: filteredPostsReducer,
  [PostActionType.FETCH_POSTS_DATA_FAIL]: postListErrorReducer,
  [PostActionType.FETCH_POSTS_DATA_SUCCEEDED]: postListRequestSucceededReducer,
  [PostActionType.IS_DELETE_POST_MODAL_OPEN]: isDeletePostModalOpenReducer,
  [PostActionType.POST_TITLE_FOR_DELETE]: postTitleForDeleteReducer,
  [PostActionType.POST_TO_DELETE_INFO]: postToDeleteInfoReducer,
}

export default createTransducer(postsReducer, INITIAL_STATE)
