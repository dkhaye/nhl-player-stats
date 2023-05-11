/**
 * @jest-environment jsdom
 */

// __tests__/index.test.jsx

import React from 'react'
import { render, screen } from '@testing-library/react'
import SeasonStats from '@/components/SeasonStats'

beforeEach(() => {
  fetch.resetMocks();
});


describe('SeasonStats', () => {
  describe('When no stats', () => {
    const getParams = () => ({
      stats: []
    })

    it('renders empty', () => {
      render(<SeasonStats {...getParams()} />)

      const table = screen.queryByLabelText("customized-table");

      expect(table).toBeNull();
    })
  });

  describe('When stats with wins but missing stats', () => {
    const getParams = () => ({
      "stats": [{
        "year": null,
        "team": null,
        "timeOnIce" : null,
        "ot" : null,
        "shutouts" : null,
        "wins" : null,
        "losses" : null,
        "saves" : null,
        "powerPlaySaves" : null,
        "shortHandedSaves" : null,
        "evenSaves" : null,
        "shortHandedShots" : null,
        "evenShots" : null,
        "powerPlayShots" : null,
        "savePercentage" : null,
        "goalAgainstAverage" : null,
        "games" : null,
        "gamesStarted" : null,
        "shotsAgainst" : null,
        "goalsAgainst" : null,
        "powerPlaySavePercentage" : null,
        "evenStrengthSavePercentage" : null
      }]
    })

    it('renders goalie table', () => {
      render(<SeasonStats {...getParams()} />)

      const table = screen.getByRole("table");

      expect(table).toMatchSnapshot();
    })
  });


  describe('When stats with wins', () => {
    const getParams = () => ({
      "stats": [{
        "year": "2005 - 2006",
        "team": "Chicago Blackhawks",
        "timeOnIce" : "86:27",
        "ot" : 1,
        "shutouts" : 0,
        "wins" : 0,
        "losses" : 0,
        "saves" : 36,
        "powerPlaySaves" : 10,
        "shortHandedSaves" : 0,
        "evenSaves" : 26,
        "shortHandedShots" : 0,
        "evenShots" : 29,
        "powerPlayShots" : 12,
        "savePercentage" : 0.878049,
        "goalAgainstAverage" : 3.470214,
        "games" : 2,
        "gamesStarted" : 1,
        "shotsAgainst" : 41,
        "goalsAgainst" : 5,
        "powerPlaySavePercentage" : 83.33333333333334,
        "evenStrengthSavePercentage" : 89.65517241379311
      }]
    })

    it('renders goalie table', () => {
      render(<SeasonStats {...getParams()} />)

      const table = screen.getByRole("table");

      expect(table).toMatchSnapshot();
    })
  });

  describe('When stats without wins', () => {
    const getParams = () => ({
      "stats": [{
        "year": "2020 - 2021",
        "team": "Chicago Blackhawks",
        "timeOnIce" : "414:23",
        "assists" : 14,
        "goals" : 7,
        "pim" : 0,
        "shots" : 79,
        "games" : 19,
        "hits" : 3,
        "powerPlayGoals" : 2,
        "powerPlayPoints" : 6,
        "powerPlayTimeOnIce" : "75:33",
        "evenTimeOnIce" : "338:10",
        "penaltyMinutes" : "0",
        "faceOffPct" : 66.67,
        "shotPct" : 8.9,
        "gameWinningGoals" : 2,
        "overTimeGoals" : 0,
        "shortHandedGoals" : 0,
        "shortHandedPoints" : 0,
        "shortHandedTimeOnIce" : "00:40",
        "blocked" : 2,
        "plusMinus" : -5,
        "points" : 21,
        "shifts" : 426
      }]
    })

    it('renders skater table', () => {
      render(<SeasonStats {...getParams()} />)

      const table = screen.getByRole("table");

      expect(table).toMatchSnapshot();
    })
  });
})
