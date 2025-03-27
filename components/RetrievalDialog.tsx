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

const EXCLUDED_KEYS = new Set(["timingInfo", "location"]);

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
  const maxDurationInfoLength = String(
    Math.max(...Object.values(retrieval.timingInfo).flat()),
  ).length;
  const reorderedTimingInfo = Object.fromEntries([
    ...Object.entries(retrieval.timingInfo).filter(
      ([key]) => !key.includes("executionContext"),
    ),
    ...Object.entries(retrieval.timingInfo).filter(([key]) =>
      key.includes("executionContext"),
    ),
  ]); // re-ordering timingInfo for keys in wanted order

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
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
                .filter(([key]) => !EXCLUDED_KEYS.has(key))
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
            <Divider sx={{ marginTop: 1, marginBottom: 3 }} />
            {/* TimingInfo */}
            {"timingInfo" in retrieval && (
              <>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ marginTop: 2, marginRight: 2 }}
                >
                  Timing Info :
                </Typography>

                <List
                  sx={{ overflowX: "auto", display: "block", maxWidth: "100%" }}
                >
                  {Object.entries(reorderedTimingInfo).map(([key, values]) => (
                    <ListItem key={key} disablePadding>
                      <ListItemText
                        primary={key}
                        secondary={
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: "monospace",
                              whiteSpace: "pre",
                              fontSize: "0.875rem",
                              color: "lightgray",
                            }}
                          >
                            {values
                              .map((value) => {
                                const strValue = String(value);
                                const diff =
                                  maxDurationInfoLength - strValue.length;
                                return " ".repeat(diff) + strValue;
                              })
                              .join(", ")}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            <Divider sx={{ marginTop: 1, marginBottom: 3 }} />
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
