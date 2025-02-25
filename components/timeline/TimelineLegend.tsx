import { TIMELINE_COLORS } from "@/lib/functions";
import { Grid2, Typography } from "@mui/material";
import { ReactElement } from "react";

export default function TimelineLegend(): ReactElement {
  return (
    <Grid2
      container
      width="100%"
      marginTop={2}
      flexDirection="row"
      justifyContent="center"
    >
      {Object.entries(TIMELINE_COLORS).map(([type, color]) => (
        <Grid2
          container
          key={type}
          marginX={2}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid2
            width={60}
            height={20}
            bgcolor={color}
            borderRadius={4}
            marginRight={1}
          />
          <Typography>{type}</Typography>
        </Grid2>
      ))}
    </Grid2>
  );
}
