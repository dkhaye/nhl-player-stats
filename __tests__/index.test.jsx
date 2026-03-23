/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Home from '../pages/index';
import PlayerSearch from '@/components/PlayerSearch';
import SeasonStats from '@/components/SeasonStats';

jest.mock('@/components/PlayerSearch', () => jest.fn(() => <div data-testid="player-search" />));
jest.mock('@/components/SeasonStats', () => jest.fn(() => <div data-testid="season-stats" />));

beforeEach(() => {
  fetch.resetMocks();
  PlayerSearch.mockClear();
  SeasonStats.mockClear();
});

const getLastProps = (MockComponent) =>
  MockComponent.mock.calls[MockComponent.mock.calls.length - 1][0];

describe('Home', () => {
  it('renders a main element', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders PlayerSearch and SeasonStats', () => {
    render(<Home />);
    expect(screen.getByTestId('player-search')).toBeInTheDocument();
    expect(screen.getByTestId('season-stats')).toBeInTheDocument();
  });

  it('passes an empty stats array to SeasonStats initially', () => {
    render(<Home />);
    expect(getLastProps(SeasonStats).stats).toEqual([]);
  });

  describe('onSearchChangeHandle', () => {
    it('fetches matching players and updates players.current when given a value', async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          suggestions: [
            "8474141|Kane|Patrick|1|0|5'10\"|177|Buffalo|NY|USA|1988-11-19|CHI|R|88|patrick-kane-8474141",
            "8480315|Kane|Evander|1|0|6'1\"|195|Toronto|ON|CAN|1996-08-02|PHI|R|9|evander-kane-8480315",
          ],
        })
      );

      render(<Home />);
      const { onSearchChangeHandle, players } = getLastProps(PlayerSearch);

      await act(async () => {
        await onSearchChangeHandle('Kane');
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://suggest.svc.nhl.com/svc/suggest/v1/minplayers/Kane/10'
      );
      expect(players.current).toEqual([
        { name: 'Patrick Kane', id: '8474141' },
        { name: 'Evander Kane', id: '8480315' },
      ]);
    });

    it('clears players.current when given an empty/falsy value', async () => {
      render(<Home />);
      const { onSearchChangeHandle, players } = getLastProps(PlayerSearch);

      // Pre-populate players
      players.current = [{ name: 'Patrick Kane', id: '8474141' }];

      await act(async () => {
        await onSearchChangeHandle('');
      });

      expect(fetch).not.toHaveBeenCalled();
      expect(players.current).toEqual([]);
    });
  });

  describe('onPlayerSelectHandle', () => {
    it('fetches career stats and sets only NHL seasons when player has an id', async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          stats: [
            {
              splits: [
                {
                  season: '20072008',
                  stat: { goals: 21, assists: 51, pim: 52, games: 82 },
                  team: { name: 'Chicago Blackhawks' },
                  league: { name: 'National Hockey League' },
                },
                {
                  season: '20062007',
                  stat: { goals: 10, assists: 20, pim: 10, games: 60 },
                  team: { name: 'London Knights' },
                  league: { name: 'Ontario Hockey League' },
                },
              ],
            },
          ],
        })
      );

      render(<Home />);
      const { onPlayerSelectHandle } = getLastProps(PlayerSearch);

      await act(async () => {
        await onPlayerSelectHandle({ id: '8474141', name: 'Patrick Kane' });
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://statsapi.web.nhl.com/api/v1/people/8474141/stats?stats=yearByYear'
      );

      const { stats } = getLastProps(SeasonStats);
      expect(stats).toHaveLength(1);
      expect(stats[0]).toEqual({
        year: '2007 - 2008',
        team: 'Chicago Blackhawks',
        goals: 21,
        assists: 51,
        pim: 52,
        games: 82,
      });
    });

    it('returns early without updating stats when rawStats has no stats property', async () => {
      fetch.mockResponseOnce(JSON.stringify({}));

      render(<Home />);
      const { onPlayerSelectHandle } = getLastProps(PlayerSearch);

      await act(async () => {
        await onPlayerSelectHandle({ id: '8474141', name: 'Patrick Kane' });
      });

      // stats should remain the initial empty array
      expect(getLastProps(SeasonStats).stats).toEqual([]);
    });

    it('clears stats when called with a value that has no id', async () => {
      // First populate some stats
      fetch.mockResponseOnce(
        JSON.stringify({
          stats: [
            {
              splits: [
                {
                  season: '20072008',
                  stat: { goals: 21 },
                  team: { name: 'Chicago Blackhawks' },
                  league: { name: 'National Hockey League' },
                },
              ],
            },
          ],
        })
      );

      render(<Home />);
      const { onPlayerSelectHandle } = getLastProps(PlayerSearch);

      await act(async () => {
        await onPlayerSelectHandle({ id: '8474141', name: 'Patrick Kane' });
      });

      expect(getLastProps(SeasonStats).stats).toHaveLength(1);

      // Now clear by calling with null (no id)
      await act(async () => {
        await onPlayerSelectHandle(null);
      });

      expect(getLastProps(SeasonStats).stats).toEqual([]);
    });
  });
});
