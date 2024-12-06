"use client";

import { getQueryPlan } from "@/lib/redux";
import { Typography, Card, CardContent } from "@mui/material";
import { ReactElement } from "react";
import { useSelector } from "react-redux";

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  return <Card></Card>;
}
