import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TableSortLabel, TextField, InputAdornment, IconButton, TablePagination,
    Checkbox,
    styled,
    Box,
    Typography,
    alpha,
    InputBase,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface Row {
    id: string | number;
    [key: string]: any;
}

interface Column {
    id: string;
    label: string;
    sortable?: boolean;
    searchable?: boolean;
    format?: (value: any, row?: Row) => string | number | React.ReactNode;
}

interface EnhancedTableProps {
    title: string;
    data: Row[];
    add?: any;
    columns: Column[];
    initialSortColumn?: string;
    initialSortDirection?: 'asc' | 'desc';
}

const EnhancedTable: React.FC<EnhancedTableProps> = ({
    title,
    add,
    data,
    columns,
    initialSortColumn,
    initialSortDirection
}) => {
    console.log("data", data)
    const [order, setOrder] = useState<'asc' | 'desc'>(initialSortDirection || 'asc');
    const [orderBy, setOrderBy] = useState<string>(initialSortColumn || '');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const inputRef = useRef<HTMLInputElement>(null);


    const handleSort = (property: string) => () => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
        if (inputRef.current) {
            inputRef.current.focus();
        }
        // setPage(0);
    };

    const clearSearch = () => {
        setSearchText('');
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchText]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = useMemo(() => {
        if (!searchText) return data;
        const lowerSearch = searchText.toLowerCase();
        return data?.filter((row) =>
            columns.some((col) =>
                col.searchable &&
                String(row[col.id] ?? '').toLowerCase().includes(lowerSearch)
            )
        );
    }, [data, columns, searchText]);

    const sortedData = useMemo(() => {
        if (!orderBy) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (aVal == null) return order === 'asc' ? -1 : 1;
            if (bVal == null) return order === 'asc' ? 1 : -1;
            if (typeof aVal === 'string') return order === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            if (typeof aVal === 'number') return order === 'asc'
                ? aVal - bVal
                : bVal - aVal;
            return 0;
        });
    }, [filteredData, orderBy, order]);

    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage;
        return sortedData?.slice(start, start + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    const renderTableCell = useCallback((row: Row, column: Column) => {
        let value = row[column.id];

        // handle nested fields like 'user.first_name'
        if (column.id.includes('.')) {
            const keys = column.id.split('.');
            value = keys.reduce((acc, key) => acc && acc[key], row);
        }

        if (column.format) {
            return (
                <TableCell key={column.id}>
                    {column.format(value, row)}
                </TableCell>
            );
        }

        return (
            <TableCell key={column.id}>
                {value}
            </TableCell>
        );
    }, []);
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        height: '54px',
        '&:nth-of-type(odd)': {
            backgroundColor: '#EFF7FD',
        },
        '&:nth-of-type(even)': {
            backgroundColor: '#FFFF',
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.95),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 1),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        maxWidth: '400px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: alpha(theme.palette.common.black, 0.4),
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            width: '100%',
        },
    }));
    return (
        <Box sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: "space-between",
                alignItems: 'center',
                // margin: 'auto',
                padding: 2,
            }}>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: '20px', sm: '24px', md: '28px' }, lineHeight: '33.89px', }} gutterBottom>
                    {title}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: "space-between",
                    alignItems: 'center',
                    // margin: 'auto',
                    padding: 2,
                }}>
                    {add &&
                        <Button
                            // component="div"
                            sx={{
                                // display: "block",
                                // width: '100%',
                                padding: "12px 12px",
                                textAlign: "center",
                                backgroundColor: "#0591FC",
                                color: "#fff",
                                borderRadius: "14px",
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "#0591FC",
                                },
                            }}
                            onClick={add}
                        >
                            ADD
                        </Button>
                    }
                    {columns?.some(col => col.searchable) && (
                        <Search
                            sx={{
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1px solid #ccc',
                                backgroundColor: '#f8f8f8', // Optional: Background color
                            }}
                        >
                            <SearchIconWrapper>
                                <SearchIcon sx={{ height: '16px', width: '16px', color: '#888' }} /> {/* Custom icon color */}
                            </SearchIconWrapper>
                            <StyledInputBase
                                fullWidth
                                placeholder="Search"
                                value={searchText}
                                inputRef={inputRef}
                                onChange={handleSearchChange}
                                inputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        searchText && (
                                            <IconButton onClick={clearSearch} size="small">
                                                <ClearIcon />
                                            </IconButton>
                                        )
                                    )
                                }}
                                sx={{
                                    color: '#333', // Input text color
                                    '::placeholder': {
                                        color: '#000', // Placeholder color
                                        opacity: 1, // Ensure visibility of placeholder
                                    },
                                }}
                            />
                        </Search>
                    )}
                </Box>
            </Box>
            <TableContainer
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // margin: 'auto',
                    // padding: 2,
                    borderRadius: 3,
                    // boxShadow: 3
                }}
            >
                <Table sx={{ maxWidth: '95%', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', backgroundColor: '#0591FC', color: '#FFFF' }}>
                    <TableHead>
                        <TableRow>
                            {columns?.map((column) => (
                                <TableCell
                                    key={column.id}
                                    sortDirection={orderBy === column.id ? order : false}
                                    sx={{ color: "white", fontWeight: "bold" }}
                                >
                                    {column.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={order}
                                            onClick={handleSort(column.id)}
                                            sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData?.map((row, index) => (
                            <StyledTableRow
                                key={row.id}
                            >
                                {columns.map((col) => renderTableCell(row, col))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={sortedData?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Box>
    );
};

export default EnhancedTable;
