/**
 * @jest-environment jsdom
 */

// __tests__/index.test.jsx

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PlayerSearch from "@/components/PlayerSearch";

beforeEach(() => {
  fetch.resetMocks();
});

describe("PlayerSearch", () => {
  const getParams = () => ({
    players: [],
    onPlayerSelectHandle: jest.fn(),
    onSearchChangeHandle: jest.fn(),
  });

  it("renders", () => {
    render(<PlayerSearch {...getParams()} />);

    const input = screen.getByLabelText("Player Search");

    expect(input).toBeInTheDocument();
  });

  it("calls onSearchChangeHandle when you type a player name", () => {
    const params = getParams();
    const { onSearchChangeHandle } = params;

    render(<PlayerSearch {...params} />);

    const input = screen.getByLabelText("Player Search");

    fireEvent.change(input, { target: { value: "Kane" } });

    expect(onSearchChangeHandle).toHaveBeenCalled();
  });
});
