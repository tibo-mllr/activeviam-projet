import { configureStore } from "@reduxjs/toolkit";
import { queryPlanReducer } from "./queryPlanReducer";

export const makeStore = () => {
  return configureStore({
    reducer: { queryPlan: queryPlanReducer.reducer },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
