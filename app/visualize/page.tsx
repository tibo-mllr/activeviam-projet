"use client";

import { buildGraph } from "@/lib/functions/buildGraph";
import { getQueryPlan } from "@/lib/redux";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import Tree, { Point, RawNodeDatum } from "react-d3-tree";
import { useSelector } from "react-redux";

const useCenteredTree = (
  defaultTranslate = { x: 0, y: 0 },
): [Point, (containerElem: HTMLDivElement) => void] => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const containerRef = useCallback((containerElem: HTMLDivElement) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 5 });
    }
  }, []);
  return [translate, containerRef];
};

export default function VisualizationPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  const [graph, setGraph] = useState<RawNodeDatum[]>([]);

  const [translate, containerRef] = useCenteredTree();

  useEffect(() => {
    if (queryPlan) {
      setGraph(
        buildGraph(queryPlan[0].dependencies, queryPlan[0].aggregateRetrievals),
      );
    }
  }, [queryPlan]);

  if (!queryPlan.length) return <>Please send a query to see the graph</>;

  if (!graph.length) return <i>Loading...</i>;

  return (
    <div
      id="treeWrapper"
      className="flex items-center justify-center w-screen h-screen bg-gray-50 dark:bg-gray-900 p-6"
      ref={containerRef}
    >
      <Tree data={graph} orientation="vertical" translate={translate} />
    </div>
  );
}
