import React, { useCallback, useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchBox = ({ onSearchPress }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback(() => {
    onSearchPress(searchText);
  }, [searchText]);

  const handleClearSearch = useCallback(() => {
    onSearchPress("");
    setSearchText("");
  }, [searchText]);

  return (
    <Stack flexDirection="row" alignItems="flex-end" px={2} py={1}>
      <TextField
        className="full-width"
        variant="standard"
        label="Search By Name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton variant="outlined" onClick={handleClearSearch}>
              <CloseIcon />
            </IconButton>
          ),
        }}
      />
      <IconButton
        color="secondary"
        variant="outlined"
        onClick={handleSearch}
        sx={{
          marginLeft: 1,
        }}
      >
        <SearchIcon />
      </IconButton>
    </Stack>
  );
};

export default SearchBox;
