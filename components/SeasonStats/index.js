//
// components/SeasonStats/index.js
//
// Generate Player Statistics table given a stats array
//

import React from "react";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

//
//  Function: SeasonStats
//  Description: renders the Table of the Player Statistics
//  Input:  stats - array of stat hashes containing year/team data
//  Output: Table of either Skater stats or Goalie stats (depending on existence of "wins") 
//
export default function SeasonStats({stats}) {
  if (stats.length > 0) {
    //Check if any year has "wins", treat as skater if not
    if (stats.findIndex((year) => {return (year.wins != null)}) == -1) {
      return(
        <div>
          <br/>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Season</StyledTableCell>
                  <StyledTableCell align="right">Team</StyledTableCell>
                  <StyledTableCell align="right">GP</StyledTableCell>
                  <StyledTableCell align="right">G</StyledTableCell>
                  <StyledTableCell align="right">A</StyledTableCell>
                  <StyledTableCell align="right">PIM</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map((row) => (
                  <StyledTableRow key={row.year + row.team}>
                    <StyledTableCell component="th" scope="row">
                      {row.year}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.team}</StyledTableCell>
                    <StyledTableCell align="right">{row.games}</StyledTableCell>
                    <StyledTableCell align="right">{row.goals}</StyledTableCell>
                    <StyledTableCell align="right">{row.assists}</StyledTableCell>
                    <StyledTableCell align="right">{row.pim}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    } else {
      //Player has "wins" and is a Goalie
      return(
        <div>
          <br/>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Season</StyledTableCell>
                  <StyledTableCell align="right">Team</StyledTableCell>
                  <StyledTableCell align="right">GP</StyledTableCell>
                  <StyledTableCell align="right">W</StyledTableCell>
                  <StyledTableCell align="right">L</StyledTableCell>
                  <StyledTableCell align="right">T/OT</StyledTableCell>
                  <StyledTableCell align="right">MIN</StyledTableCell>
                  <StyledTableCell align="right">GA</StyledTableCell>
                  <StyledTableCell align="right">SO</StyledTableCell>
                  <StyledTableCell align="right">GAA</StyledTableCell>
                  <StyledTableCell align="right">SV%</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map((row) => (
                  <StyledTableRow key={row.year + row.team}>
                    <StyledTableCell component="th" scope="row">
                      {row.year}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.team}</StyledTableCell>
                    <StyledTableCell align="right">{row.games}</StyledTableCell>
                    <StyledTableCell align="right">{row.wins}</StyledTableCell>
                    <StyledTableCell align="right">{row.losses}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.ties ? row.ties : (row.ot ? row.ot : "-")}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.timeOnIce.split(":")[0]}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.goalsAgainst ? row.goalsAgainst : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.shotsAgainst ? row.goalsAgainst : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.goalAgainstAverage ? row.goalAgainstAverage.toFixed(2) : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.savePercentage ? (row.savePercentage * 100).toFixed(2)+"%" : "-"}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    }
  } else {
    return(
      <div />
    );
  }
}
