import { AppBar, Button, Container, Toolbar } from "@mui/material";
import Link from "next/link";
import { ReactElement } from "react";
import PlanSelector from "./PlanSelector";

export function Header(): ReactElement {
  return (
    <AppBar position="static" enableColorOnDark color="inherit">
      <Container maxWidth={false} disableGutters>
        <Toolbar sx={{ gap: 2 }}>
          <Link href="/submit-query">
            <Button variant="outlined">Query</Button>
          </Link>
          <Link href="/summary">
            <Button variant="outlined">Summary</Button>
          </Link>
          <Link href="/timeline">
            <Button variant="outlined">Timeline</Button>
          </Link>
          <Link href="/nodes">
            <Button variant="outlined">Nodes</Button>
          </Link>
          <div className="py-3 ml-auto">
            <PlanSelector />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
