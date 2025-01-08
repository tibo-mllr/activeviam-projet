import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QueryPlan } from "../types";

type State = { queryPlan: QueryPlan[] | ""; selectedIndex: number };

const initialState: State = { queryPlan: "", selectedIndex: 0 };

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
  },
  selectors: {
    getQueryPlan: (state) => state.queryPlan,
    getSelectedIndex: (state) => state.selectedIndex,
  },
});

export const { setQueryPlan, setSelectedIndex } = queryPlanReducer.actions;

export const { getQueryPlan, getSelectedIndex } = queryPlanReducer.selectors;
