import { styled } from "@mui/material/styles";

// Root container for the entire layout
export const Root = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100vh',
  overflow: 'hidden', // Prevents any horizontal scrollbar on the main container
});
