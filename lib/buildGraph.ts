import { RawNodeDatum } from "react-d3-tree";
import { AggregateRetrieval } from "./queryPlan";

export function buildGraph(
  dependencies: Record<string, number[]>,
  aggregateRetrievals: AggregateRetrieval[],
  rootKey: string = "-1",
): RawNodeDatum[] {
  const retrievalMap: Record<number, AggregateRetrieval> = {};

  // Combine aggregate and database retrievals into a map by retrievalId
  aggregateRetrievals.forEach((retrieval) => {
    retrievalMap[retrieval.retrievalId] = retrieval;
  });

  // Recursive function to build nodes
  const createNode = (retrievalId: number): RawNodeDatum => {
    const retrieval = retrievalMap[retrievalId];
    if (!retrieval) {
      return { name: `Unknown Node ${retrievalId}` };
    }

    const node: RawNodeDatum = {
      name: retrieval.type || `Retrieval ${retrievalId}`,
      attributes: {
        retrievalId: retrievalId,
      },
      children: [],
    };

    // Add children recursively
    const childIds = dependencies[retrievalId] || [];
    node.children = childIds.map(createNode);

    return node;
  };

  // Build the graph starting from rootKey
  const rootRetrievalIds = dependencies[rootKey] || [];
  return rootRetrievalIds.map(createNode);
}
