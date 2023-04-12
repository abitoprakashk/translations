import {PostActionType} from '../actionTypes'

export const fetchPostsDataRequestAction = () => {
  return {
    type: PostActionType.FETCH_POSTS_DATA_REQUEST,
  }
}

export const setPostListAction = (posts_list) => {
  return {
    type: PostActionType.POST_LIST,
    payload: posts_list,
  }
}

export const setFilteredPostsAction = (filtered_Posts) => {
  return {
    type: PostActionType.FILTERED_POST_LIST,
    payload: filtered_Posts,
  }
}

export const setIsDeletePostModalOpenAction = (isModalOpen) => {
  return {
    type: PostActionType.IS_DELETE_POST_MODAL_OPEN,
    payload: isModalOpen,
  }
}

export const setPostTitleForDeleteAction = (postTitle) => {
  return {
    type: PostActionType.POST_TITLE_FOR_DELETE,
    payload: postTitle,
  }
}

export const setPostToDeleteInfoAction = (data) => {
  return {
    type: PostActionType.POST_TO_DELETE_INFO,
    payload: data,
  }
}
