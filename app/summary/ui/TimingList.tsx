import { Box, List, ListItem, ListItemText } from "@mui/material";
import React from "react";

interface TimingListProps {
  data: Record<string, number>;
  colorMap?: Record<string, string>; // color not mandatory
}

const TimingList: React.FC<TimingListProps> = ({ data, colorMap }) => {
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
};

export default TimingList;
