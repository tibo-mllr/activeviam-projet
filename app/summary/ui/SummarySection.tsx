import InfoIcon from "@mui/icons-material/Info";
import {
  Grid2,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";

interface SummarySectionProps {
  title: string;
  description: string;
  data: string[] | Record<string, number>;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  title,
  description,
  data,
}) => {
  return (
    <Grid2 padding={1} spacing={1}>
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: 2,
          marginTop: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
          <Tooltip title={description}>
            <IconButton size="small" style={{ marginLeft: 8 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <List dense sx={{ marginLeft: 4 }}>
          {Array.isArray(data)
            ? data.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText primary={item} />
                </ListItem>
              ))
            : Object.entries(data).map(([key, value]) => (
                <ListItem key={key} disablePadding>
                  <ListItemText primary={`${key}: ${value}`} />
                </ListItem>
              ))}
        </List>
      </Box>
    </Grid2>
  );
};

export default SummarySection;
