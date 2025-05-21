import React from "react";
import { TablePagination, styled } from "@mui/material";

const CustomTablePagination = styled(TablePagination)(({ theme }) => ({
  "& .MuiTablePagination-toolbar": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "& .MuiTablePagination-spacer": {
    flex: 0, // Remove default spacer behavior
  },
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
    marginRight: theme.spacing(2), // Adds spacing between label and dropdown
  },
  "& .MuiTablePagination-actions": {
    marginLeft: "auto", // Push pagination actions to the right
  },
}));

export default function PaginationComponent(props) {
  return (
    <CustomTablePagination
      component="div"
      count={props.totalMachines}
      page={props.page}
      onPageChange={props.onPageChange}
      rowsPerPage={props.rowsPerPage}
      onRowsPerPageChange={props.onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
