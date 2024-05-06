import {
  GET_CATEGORIES,
  GET_CATEGORY,
  STORE_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
} from "src/constants/category";

const categoriesState = {
  categories: [],
};

export const categories = (state = categoriesState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case GET_CATEGORIES:
      return {
        categories: payload,
      };

    default:
      return state;
  }
};

const categoryState = {
  category: null,
};

export const category = (state = categoryState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case GET_CATEGORY:
      return {
        category: payload,
      };

    default:
      return state;
  }
};

const storeCategoryState = {
  inserted: false,
};

export const storeCategory = (state = storeCategoryState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case STORE_CATEGORY:
      return {
        inserted: payload,
      };

    default:
      return state;
  }
};

const updateCategoryState = {
  updated: false,
};

export const updateCategory = (state = updateCategoryState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_CATEGORY:
      return {
        updated: payload,
      };

    default:
      return state;
  }
};

const deleteCategoryState = {
  deleted: false,
};

export const deleteCategory = (state = deleteCategoryState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case REMOVE_CATEGORY:
      return {
        deleted: payload,
      };

    default:
      return state;
  }
};
