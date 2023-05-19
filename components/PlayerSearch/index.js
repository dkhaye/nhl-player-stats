//
// components/PlayerSearch/index.js
//
// Autocomplete component for the Player Search textbox
//

import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

//
//  Function: PlayerSearch
//  Description: renders the Autocomplete textbox for searching for players
//  Input:  players - array of players to show in combobox
//          onPlayerSelectHandle - function to call when the user selects a player
//          onSearchChangeHandle - function to call when the user types/updates the textbox
//  Output: Autocomplete box including a textbox to type player name, 
//          combobox to select possible options, and a loading circle
//
export default function PlayerSearch({players, onPlayerSelectHandle, onSearchChangeHandle}) {
  const [open, setOpen] = React.useState(false);
  const loading = open && players.current.length === 0;

  React.useEffect(() => {
    if (!open) {
      players.current = [];
    }
  }, [open, players]);

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
