import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QueryPlan } from "../types";

type State = {
  queryPlan: QueryPlan[] | "";
  selectedIndex: number;
  isLargeQueryPlan: boolean;
};

const initialState: State = {
  queryPlan: "",
  selectedIndex: 0,
  isLargeQueryPlan: false,
};

export const queryPlanReducer = createSlice({
  name: "queryPlan",
  initialState,
  reducers: {
    setQueryPlan(state, action: PayloadAction<QueryPlan[] | "">) {
      state.queryPlan = action.payload;
    },
    setSelectedIndex(state, action: PayloadAction<number>) {
      state.selectedIndex = action.payload;
    },
    setIsLargeQueryPlan(state, action: PayloadAction<boolean>) {
      state.isLargeQueryPlan = action.payload;
    },
  },
  selectors: {
    getQueryPlan: (state) => state.queryPlan,
    getSelectedIndex: (state) => state.selectedIndex,
    getIsLargeQueryPlan: (state) => state.isLargeQueryPlan,
  },
});

export const { setQueryPlan, setSelectedIndex, setIsLargeQueryPlan } =
  queryPlanReducer.actions;

export const { getQueryPlan, getSelectedIndex, getIsLargeQueryPlan } =
  queryPlanReducer.selectors;
