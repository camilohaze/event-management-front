import { Dispatch } from "redux";
import {
  GET_CATEGORIES,
  GET_CATEGORY,
  STORE_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
} from "src/constants/category";
import {
  RequestCategory,
  ResponseCategory,
  ResponseStoreCategory,
  ResponseUpdateCategory,
  ResponseDeleteCategory,
} from "src/interfaces/category";
import { API } from "src/utils/API";

export const getAllCategories = () => async (dispatch: Dispatch) => {
  return await API.get<ResponseCategory[]>("/categories").then((response) => {
    const { data } = response;

    dispatch({
      type: GET_CATEGORIES,
      payload: data,
    });
  });
};

export const getCategoryById =
  (categoryId: number) => async (dispatch: Dispatch) => {
    return await API.get<ResponseCategory>(`/categories/${categoryId}`)
      .then((response) => {
        const { data } = response;

        dispatch({
          type: GET_CATEGORY,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_CATEGORY,
          payload: null,
        });

        throw error;
      });
  };

export const storeCategory =
  (category: RequestCategory) => async (dispatch: Dispatch) => {
    return await API.post<ResponseStoreCategory>("/categories", category).then(
      (response) => {
        const { data } = response;

        dispatch({
          type: STORE_CATEGORY,
          payload: data,
        });
      }
    );
  };

export const updateCategory =
  (category: RequestCategory) => async (dispatch: Dispatch) => {
    return await API.put<ResponseUpdateCategory>("/categories", category).then(
      (response) => {
        const { data } = response;

        dispatch({
          type: UPDATE_CATEGORY,
          payload: data,
        });
      }
    );
  };

export const removeCategory =
  (categoryId: number) => async (dispatch: Dispatch) => {
    return await API.delete<ResponseDeleteCategory>(
      `/categories/${categoryId}`
    ).then((response) => {
      const { data } = response;

      dispatch({
        type: REMOVE_CATEGORY,
        payload: data,
      });
    });
  };
