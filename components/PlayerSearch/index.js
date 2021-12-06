import fetch from "cross-fetch";
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import SeasonStats from '@/components/SeasonStats';

export default function PlayerSearch({players, onPlayerSelectHandle, onSearchChangeHandle}) {
  const [open, setOpen] = React.useState(false);
  const loading = open && players.length === 0;

  React.useEffect(() => {
    if (!open) {
      players = [];
    }
  }, [open]);

  return (
    <Autocomplete
      id="player-search"
      style={{ width: 400 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={option => option.name}
      options={players}
      loading={loading}
      onChange={(ev, value) => {
        onPlayerSelectHandle(value);
      }}
      renderInput={params => (
        <TextField
          {...params}
          label="Player Search"
          variant="outlined"
          onChange={ev => {
            // dont fire API if the user delete or not entered anything
            if (ev.target.value !== "" || ev.target.value !== null) {
              onSearchChangeHandle(ev.target.value);
            }
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}
