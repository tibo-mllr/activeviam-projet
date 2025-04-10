import { Box, List, ListItem, ListItemText } from "@mui/material";
import { ReactElement } from "react";

type TimingListProps = {
  data: Record<string, number>;
  colorMap?: Record<string, string>;
};

export function TimingList({ data, colorMap }: TimingListProps): ReactElement {
  return (
    <List dense sx={{ marginLeft: 4 }}>
      {Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => (
          <ListItem key={key} disablePadding>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: colorMap?.[key] || "transparent",
                marginRight: 1,
              }}
            />
            <ListItemText primary={`${key} : ${value} ms`} />
          </ListItem>
        ))}
    </List>
  );
}
