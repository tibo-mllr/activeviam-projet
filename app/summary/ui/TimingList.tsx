import { Box, List, ListItem, ListItemText } from "@mui/material";
import { ReactElement } from "react";

type TimingListProps = {
  data: Record<string, number>;
  colorMap?: Record<string, string>;
  unit?: string;
};

export function TimingList({
  data,
  colorMap,
  unit = "", // by default no unit is shown
}: TimingListProps): ReactElement {
  return (
    <List
      dense
      sx={{
        marginLeft: 2,
        overflowY: "auto",
        flex: 1,
      }}
    >
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
            <ListItemText primary={`${key} : ${value} ${unit}`} />
          </ListItem>
        ))}
    </List>
  );
}
