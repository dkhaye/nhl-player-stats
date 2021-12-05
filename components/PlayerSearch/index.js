import fetch from "cross-fetch";
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import SeasonStats from 'components/SeasonStats';

export default function PlayerSearch() {
  const [open, setOpen] = React.useState(false);
  const [players, setPlayers] = React.useState([]);
  const [stats, setStats] = React.useState([]);
  const loading = open && players.length === 0;

  const onSearchChangeHandle = async value => {
    const response = await fetch(
      "https://suggest.svc.nhl.com/svc/suggest/v1/minplayers/" + value + "/10"
    );

    const players = await response.json();

    setPlayers(players["suggestions"].map( str => {
      let els = str.split("|");
      let playerObj = {
        name: els[2] + " " + els[1],
        id: els[0]
      };
      return playerObj;
    }));
  };

  const onPlayerSelectHandle = async id => {
    const response = await fetch(
      "https://statsapi.web.nhl.com/api/v1/people/" + id + "/stats?stats=yearByYear"
    );
    const rawStats = await response.json();

    if (!rawStats || !rawStats["stats"]) {
      return {}
    }

    const nhlSeasons = rawStats["stats"][0]["splits"].filter( seasonHash => {
      return seasonHash["league"]["name"] == "National Hockey League"
    });

    setStats(nhlSeasons.map( seasonHash => {
      return {
        year: seasonHash.season.substr(0,4) + " - " + seasonHash.season.substr(4,4),
        team: seasonHash.team.name,
        games: seasonHash.stat.games,
        goals: seasonHash.stat.goals,
        assists: seasonHash.stat.assists,
        toi: seasonHash.stat.timeOnIce,
      }
    }));
  };

  React.useEffect(() => {
    if (!open) {
      setPlayers([]);
    }
  }, [open]);

  return (
    <div>
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
          if (ev.target.value !== "") {
            onPlayerSelectHandle(value.id);
          }
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
      {<SeasonStats stats={stats} />}
    </div>
  );
}
