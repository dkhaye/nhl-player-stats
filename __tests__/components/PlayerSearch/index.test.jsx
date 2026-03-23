/**
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PlayerSearch from '@/components/PlayerSearch';

beforeEach(() => {
  fetch.resetMocks();
});

describe('PlayerSearch', () => {
  const makePlayers = (items = []) => {
    // Create an array that also has a .current property, mirroring the useRef shape
    // the parent passes while still being a valid MUI Autocomplete options array.
    const arr = [...items];
    arr.current = items;
    return arr;
  };

  const getParams = (items = []) => ({
    players: makePlayers(items),
    onPlayerSelectHandle: jest.fn(),
    onSearchChangeHandle: jest.fn(),
  });

  it('renders the Player Search input', () => {
    render(<PlayerSearch {...getParams()} />);
    expect(screen.getByLabelText('Player Search')).toBeInTheDocument();
  });

  it('calls onSearchChangeHandle when the user types a player name', () => {
    const params = getParams();
    render(<PlayerSearch {...params} />);

    const input = screen.getByLabelText('Player Search');
    fireEvent.change(input, { target: { value: 'Kane' } });

    expect(params.onSearchChangeHandle).toHaveBeenCalledWith('Kane');
  });

  it('shows a loading spinner when the dropdown is open and there are no options', async () => {
    const params = getParams(); // empty players
    render(<PlayerSearch {...params} />);

    // Open the dropdown
    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('does not show a loading spinner when the dropdown is closed', () => {
    const params = getParams();
    render(<PlayerSearch {...params} />);

    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('clears players.current when the dropdown is closed', async () => {
    const params = getParams();
    params.players.current = [{ name: 'Patrick Kane', id: '8474141' }];
    render(<PlayerSearch {...params} />);

    // Open then close
    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);
    fireEvent.keyDown(input, { key: 'Escape' });

    await waitFor(() => {
      expect(params.players.current).toEqual([]);
    });
  });

  it('calls onPlayerSelectHandle when a player option is selected', async () => {
    const player = { name: 'Patrick Kane', id: '8474141' };
    const params = getParams([player]);
    render(<PlayerSearch {...params} />);

    // Open the dropdown
    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);

    // Wait for the option to appear and click it
    const option = await screen.findByText('Patrick Kane');
    fireEvent.click(option);

    expect(params.onPlayerSelectHandle).toHaveBeenCalledWith(player);
  });
});
