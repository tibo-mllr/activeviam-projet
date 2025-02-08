import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QueryPlan } from "../types";

type State = {
  queryPlan: QueryPlan[] | "";
  selectedIndex: number;
  isManual: boolean;
};

const initialState: State = {
  queryPlan: "",
  selectedIndex: 0,
  isManual: false,
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
    setIsManual(state, action: PayloadAction<boolean>) {
      state.isManual = action.payload;
    },
  },
  selectors: {
    getQueryPlan: (state) => state.queryPlan,
    getSelectedIndex: (state) => state.selectedIndex,
    getIsManual: (state) => state.isManual,
  },
});

export const { setQueryPlan, setSelectedIndex, setIsManual } =
  queryPlanReducer.actions;

export const { getQueryPlan, getSelectedIndex, getIsManual } =
  queryPlanReducer.selectors;
