"use client";

import { getQueryPlan } from "@/lib/redux";
import { Card } from "@mui/material";
import { ReactElement } from "react";
import { useSelector } from "react-redux";

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  console.log(queryPlan);
  return <Card></Card>;
}
