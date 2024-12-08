import { AppBar, Button, Container, Toolbar } from "@mui/material";
import Link from "next/link";
import { ReactElement } from "react";

export function Header(): ReactElement {
  return (
    <AppBar position="static" enableColorOnDark color="inherit">
      <Container maxWidth={false} disableGutters>
        <Toolbar sx={{ gap: 2 }}>
          <Link href="/submit-query">
            <Button variant="outlined">Query</Button>
          </Link>
          <Link href="/visualize">
            <Button variant="outlined">Visualization</Button>
          </Link>
          <Link href="/summary">
            <Button variant="outlined">Summary</Button>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
