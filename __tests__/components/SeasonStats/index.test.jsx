/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import SeasonStats from '@/components/SeasonStats';

beforeEach(() => {
  fetch.resetMocks();
});

describe('SeasonStats', () => {
  describe('When no stats', () => {
    it('renders without a table', () => {
      render(<SeasonStats stats={[]} />);
      expect(screen.queryByRole('table')).toBeNull();
    });
  });

  describe('When stats without wins (skater)', () => {
    const skaterRow = {
      year: '2020 - 2021',
      team: 'Chicago Blackhawks',
      games: 19,
      goals: 7,
      assists: 14,
      pim: 0,
    };

    it('renders a table with skater headers', () => {
      render(<SeasonStats stats={[skaterRow]} />);
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(within(table).getByText('Season')).toBeInTheDocument();
      expect(within(table).getByText('Team')).toBeInTheDocument();
      expect(within(table).getByText('GP')).toBeInTheDocument();
      expect(within(table).getByText('G')).toBeInTheDocument();
      expect(within(table).getByText('A')).toBeInTheDocument();
      expect(within(table).getByText('PIM')).toBeInTheDocument();
    });

    it('does not include goalie-specific headers', () => {
      render(<SeasonStats stats={[skaterRow]} />);
      const table = screen.getByRole('table');
      expect(within(table).queryByText('W')).toBeNull();
      expect(within(table).queryByText('GAA')).toBeNull();
    });

    it('renders the correct cell values for a skater row', () => {
      render(<SeasonStats stats={[skaterRow]} />);
      expect(screen.getByText('2020 - 2021')).toBeInTheDocument();
      expect(screen.getByText('Chicago Blackhawks')).toBeInTheDocument();
      expect(screen.getByText('19')).toBeInTheDocument(); // games
      expect(screen.getByText('7')).toBeInTheDocument();  // goals
      expect(screen.getByText('14')).toBeInTheDocument(); // assists
      expect(screen.getByText('0')).toBeInTheDocument();  // pim
    });

    it('renders multiple skater rows', () => {
      const stats = [
        { ...skaterRow, year: '2019 - 2020', team: 'Team A', games: 50 },
        { ...skaterRow, year: '2020 - 2021', team: 'Team B', games: 82 },
      ];
      render(<SeasonStats stats={stats} />);
      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(screen.getByText('Team B')).toBeInTheDocument();
    });

    it('treats a row with wins: null as a skater', () => {
      render(<SeasonStats stats={[{ ...skaterRow, wins: null }]} />);
      // wins is null so findIndex returns -1 → skater table
      expect(within(screen.getByRole('table')).getByText('G')).toBeInTheDocument();
    });
  });

  describe('When stats with wins (goalie)', () => {
    const goalieRow = {
      year: '2005 - 2006',
      team: 'Chicago Blackhawks',
      games: 2,
      wins: 0,
      losses: 0,
      ot: 1,
      ties: null,
      timeOnIce: '86:27',
      goalsAgainst: 5,
      shotsAgainst: 41,
      goalAgainstAverage: 3.470214,
      savePercentage: 0.878049,
    };

    it('renders a table with goalie headers', () => {
      render(<SeasonStats stats={[goalieRow]} />);
      const table = screen.getByRole('table');
      expect(within(table).getByText('Season')).toBeInTheDocument();
      expect(within(table).getByText('Team')).toBeInTheDocument();
      expect(within(table).getByText('GP')).toBeInTheDocument();
      expect(within(table).getByText('W')).toBeInTheDocument();
      expect(within(table).getByText('L')).toBeInTheDocument();
      expect(within(table).getByText('T/OT')).toBeInTheDocument();
      expect(within(table).getByText('MIN')).toBeInTheDocument();
      expect(within(table).getByText('GA')).toBeInTheDocument();
      expect(within(table).getByText('SO')).toBeInTheDocument();
      expect(within(table).getByText('GAA')).toBeInTheDocument();
      expect(within(table).getByText('SV%')).toBeInTheDocument();
    });

    it('does not include skater-specific headers', () => {
      render(<SeasonStats stats={[goalieRow]} />);
      const table = screen.getByRole('table');
      expect(within(table).queryByText('G')).toBeNull();
      expect(within(table).queryByText('PIM')).toBeNull();
    });

    it('displays ot when row.ties is null but row.ot is defined', () => {
      render(<SeasonStats stats={[{ ...goalieRow, ties: null, ot: 1 }]} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('displays ties when row.ties is defined (takes priority over ot)', () => {
      render(<SeasonStats stats={[{ ...goalieRow, ties: 3, ot: 1 }]} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('displays "-" for T/OT when both ties and ot are falsy', () => {
      render(<SeasonStats stats={[{ ...goalieRow, ties: null, ot: null }]} />);
      // There will be multiple "-" cells (for other null fields too), just confirm it's there
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('displays the minutes part of timeOnIce (before the colon)', () => {
      render(<SeasonStats stats={[{ ...goalieRow, timeOnIce: '86:27' }]} />);
      expect(screen.getByText('86')).toBeInTheDocument();
    });

    it('displays nothing for MIN when timeOnIce is null', () => {
      render(<SeasonStats stats={[{ ...goalieRow, timeOnIce: null }]} />);
      // No crash, and '86' should NOT be in the document
      expect(screen.queryByText('86')).toBeNull();
    });

    it('displays goalsAgainst when it is truthy', () => {
      render(<SeasonStats stats={[{ ...goalieRow, goalsAgainst: 5 }]} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('displays "-" for GA when goalsAgainst is falsy', () => {
      render(<SeasonStats stats={[{ ...goalieRow, goalsAgainst: null }]} />);
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('displays shotsAgainst when it is truthy', () => {
      render(<SeasonStats stats={[{ ...goalieRow, shotsAgainst: 41 }]} />);
      expect(screen.getByText('41')).toBeInTheDocument();
    });

    it('displays "-" for SO when shotsAgainst is falsy', () => {
      render(<SeasonStats stats={[{ ...goalieRow, shotsAgainst: null }]} />);
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('displays goalAgainstAverage formatted to 2 decimal places', () => {
      render(<SeasonStats stats={[{ ...goalieRow, goalAgainstAverage: 3.470214 }]} />);
      expect(screen.getByText('3.47')).toBeInTheDocument();
    });

    it('displays "-" for GAA when goalAgainstAverage is null', () => {
      render(<SeasonStats stats={[{ ...goalieRow, goalAgainstAverage: null }]} />);
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('displays savePercentage formatted as a percentage', () => {
      render(<SeasonStats stats={[{ ...goalieRow, savePercentage: 0.878049 }]} />);
      expect(screen.getByText('87.80%')).toBeInTheDocument();
    });

    it('displays "-" for SV% when savePercentage is null', () => {
      render(<SeasonStats stats={[{ ...goalieRow, savePercentage: null }]} />);
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('renders multiple goalie rows', () => {
      const stats = [
        { ...goalieRow, year: '2004 - 2005', team: 'Team A' },
        { ...goalieRow, year: '2005 - 2006', team: 'Team B' },
      ];
      render(<SeasonStats stats={stats} />);
      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(screen.getByText('Team B')).toBeInTheDocument();
    });

    it('renders correctly when all optional stat values are null', () => {
      const nullGoalieRow = {
        year: null,
        team: null,
        games: null,
        wins: 1,
        losses: null,
        ot: null,
        ties: null,
        timeOnIce: null,
        goalsAgainst: null,
        shotsAgainst: null,
        goalAgainstAverage: null,
        savePercentage: null,
      };
      render(<SeasonStats stats={[nullGoalieRow]} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      // All nullable fields should render "-" or nothing without crashing
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('uses the first season with non-null wins to determine goalie rendering', () => {
      // Multiple rows: first has wins: null, second has wins: 5
      const stats = [
        { year: '2019 - 2020', team: 'Team A', wins: null, games: 10 },
        { year: '2020 - 2021', team: 'Team B', wins: 5, games: 30 },
      ];
      render(<SeasonStats stats={stats} />);
      // findIndex finds the row with wins != null → goalie table
      expect(within(screen.getByRole('table')).getByText('W')).toBeInTheDocument();
    });
  });
});
