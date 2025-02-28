import { AggregateRetrieval, DatabaseRetrieval } from "@/lib/types";
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
}: RetrievalDialogProps): ReactElement | null {
  if (!retrieval) return null;

  const isAggregate = "partialProviderName" in retrieval;
  const excludedKeys = new Set(["timingInfo", "location"]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
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
              Retrieval ID : {retrieval.retrievalId}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            {/* General keys */}
            <List>
              {Object.entries(retrieval)
                .filter(([key]) => !excludedKeys.has(key))
                .map(([key, value]) => (
                  <ListItem key={key} disablePadding>
                    <ListItemText
                      primary={`${key} :`}
                      secondary={
                        Array.isArray(value) ? value.join(", ") : String(value)
                      }
                    />
                  </ListItem>
                ))}
            </List>

            {/* TimingInfo */}
            {"timingInfo" in retrieval && (
              <>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ marginTop: 2 }}
                >
                  Timing Info :
                </Typography>
                <List>
                  {Object.entries(retrieval.timingInfo).map(
                    ([key, values]) =>
                      !key.includes("executionContext") && (
                        <ListItem key={key} disablePadding>
                          <ListItemText
                            primary={key}
                            secondary={values.join(", ")}
                          />
                        </ListItem>
                      ),
                  )}
                  {Object.entries(retrieval.timingInfo).map(
                    ([key, values]) =>
                      key.includes("executionContext") && (
                        <ListItem key={key} disablePadding>
                          <ListItemText
                            primary={key}
                            secondary={values.join(", ")}
                          />
                        </ListItem>
                      ),
                  )}
                </List>
              </>
            )}

            {/* Location (only if aggregate) */}
            {isAggregate &&
              "location" in retrieval &&
              Array.isArray(retrieval.location) &&
              retrieval.location.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ marginTop: 2 }}
                  >
                    Location :
                  </Typography>
                  <List>
                    {retrieval.location.map((loc, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemText
                          secondary={
                            <>
                              {Object.entries(loc).map(([key, value], idx) => (
                                <span key={idx}>
                                  <strong>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    :
                                  </strong>{" "}
                                  {Array.isArray(value)
                                    ? value.join(", ")
                                    : value}
                                  <br />
                                </span>
                              ))}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
