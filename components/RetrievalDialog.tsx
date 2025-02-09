import { AggregateRetrieval, DatabaseRetrieval, TimingInfo } from "@/lib/types";
import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { type ReactElement } from "react";

type RetrievalDialogProps = {
  retrieval: AggregateRetrieval | DatabaseRetrieval;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function RetrievalDialog({
  retrieval,
  open,
  setOpen,
}: RetrievalDialogProps): ReactElement {
  if (!retrieval) return <></>;

  const isAggregate = "partialProviderName" in retrieval;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {isAggregate ? "Aggregate Retrieval" : "Database Retrieval"}
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Card sx={{ padding: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Retrieval ID: {retrieval.retrievalId}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            {isAggregate ? (
              <>
                <Typography variant="body1">
                  <strong>Provider:</strong> {retrieval.partialProviderName}
                </Typography>
                <Typography variant="body1">
                  <strong>Type:</strong> {retrieval.type}
                </Typography>
                <Typography variant="body1">
                  <strong>Partitioning:</strong> {retrieval.partitioning}
                </Typography>
                <Typography variant="body1">
                  <strong>Measure Provider:</strong> {retrieval.measureProvider}
                </Typography>
                <Typography variant="body1">
                  <strong>Filter ID:</strong> {retrieval.filterId}
                </Typography>
                <Typography variant="body1">
                  <strong>Measures:</strong>
                </Typography>
                <List dense>
                  {retrieval.measures.map((measure, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={measure} />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="body1">
                  <strong>Underlying Data Nodes:</strong>
                </Typography>
                <List dense>
                  {retrieval.underlyingDataNodes.map((node, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={node} />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <>
                <Typography variant="body1">
                  <strong>Store:</strong> {retrieval.store}
                </Typography>
                <Typography variant="body1">
                  <strong>Condition:</strong> {retrieval.condition}
                </Typography>
                <Typography variant="body1">
                  <strong>Fields:</strong>
                </Typography>
                <List dense>
                  {retrieval.fields.map((field, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={field} />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="body1">
                  <strong>Joined Measures:</strong>
                </Typography>
                <List dense>
                  {retrieval.joinedMeasure.map((measure, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={measure} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <Typography variant="body1">
              <strong>Timing Info:</strong>
            </Typography>
            <List dense>
              {Object.entries(retrieval.timingInfo).map(
                ([key, values], index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${key}: ${values.join(", ")}`} />
                  </ListItem>
                ),
              )}
            </List>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
