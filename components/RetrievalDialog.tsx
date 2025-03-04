"use client";

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
  Switch,
  Tooltip,
} from "@mui/material";
import { type ReactElement, useState } from "react";

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
  const [areNumbersAligned, setAreNumbersAligned] = useState<boolean>(false);
  if (!retrieval) return null;

  const isAggregate = "partialProviderName" in retrieval;
  const excludedKeys = new Set(["timingInfo", "location"]);
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

                <List>
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
                                if (areNumbersAligned) {
                                  const diff =
                                    maxDurationInfoLength - strValue.length;
                                  return " ".repeat(diff) + strValue;
                                }
                                return strValue;
                              })
                              .join(", ")}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Tooltip title="Align numbers" arrow placement="right">
                  <Switch
                    checked={areNumbersAligned}
                    onChange={() => setAreNumbersAligned((prev) => !prev)}
                    sx={{ transform: "scale(0.8)" }}
                  />
                </Tooltip>
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
