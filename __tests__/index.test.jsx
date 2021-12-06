/**
 * @jest-environment jsdom
 */

// __tests__/index.test.jsx

import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

beforeEach(() => {
  fetch.resetMocks();
});

describe('Home', () => {
  it('renders a heading', () => {
    fetch.mockResponseOnce(JSON.stringify({}));

    render(<Home />)

    const heading = screen.getByRole('main'); 

    expect(heading).toBeInTheDocument()
  })
})
