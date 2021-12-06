/**
 * @jest-environment jsdom
 */

// __tests__/index.test.jsx

import React from 'react'
import { render, screen } from '@testing-library/react'
import PlayerSearch from '@/components/PlayerSearch'

beforeEach(() => {
  fetch.resetMocks();
});

describe('PlayerSearch', () => {
  const getParams = () => ({
    players: [],
    onPlayerSelectHandle: jest.mock(),
    onSearchChangeHandle: jest.mock(),
  }); 

  it('renders', () => {
    render(<PlayerSearch {...getParams()} />)

    const input = screen.getByLabelText('Player Search'); 

    expect(input).toBeInTheDocument()
  })
})
