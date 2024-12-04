import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QueryPlan } from "../types";

type State = QueryPlan | "";

const initialState = "" as State;

export const queryPlanReducer = createSlice({
  name: "queryPlan",
  initialState,
  reducers: {
    setQueryPlan: (_, action: PayloadAction<State>) => action.payload,
  },
  selectors: {
    getQueryPlan: (state) => state,
  },
});

export const { setQueryPlan } = queryPlanReducer.actions;

export const { getQueryPlan } = queryPlanReducer.selectors;
