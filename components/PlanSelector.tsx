"use client";

import {
  getQueryPlan,
  getSelectedIndex,
  setSelectedIndex,
  useAppDispatch,
} from "@/lib/redux";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { usePathname } from "next/navigation";
import { type ReactElement } from "react";
import { useSelector } from "react-redux";

export default function PlanSelector(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);
  const dispatch = useAppDispatch();

  const pathname = usePathname();

  if (pathname == "/submit-query" || !queryPlan || queryPlan.length < 2)
    return <></>;

  return (
    <FormControl fullWidth>
      <InputLabel id="query-plan-select-label">Select Query Plan</InputLabel>
      <Select
        labelId="query-plan-select-label"
        value={selectedIndex}
        onChange={(event) =>
          dispatch(setSelectedIndex(event.target.value as number))
        }
        label="Select Query Plan"
      >
        {queryPlan.map((_plan, index) => (
          <MenuItem key={index} value={index}>
            {queryPlan[index].planInfo.mdxPass}
          </MenuItem>
        ))}
        {queryPlan.length > 1 && <MenuItem value={-1}>All Plans</MenuItem>}
      </Select>
    </FormControl>
  );
}
