import { AggregateRetrieval } from "@/lib/types";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { type ReactElement } from "react";

type RetrievalDialogProps = {
  retrieval: AggregateRetrieval;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RetrievalDialog({
  retrieval,
  open,
  setOpen,
}: RetrievalDialogProps): ReactElement {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Retrieval</DialogTitle>
      <IconButton
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <pre>{JSON.stringify(retrieval, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
}
