/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import SeasonStats from "@/components/SeasonStats";

describe("SeasonStats rendering", () => {
  it("renders skater seasons with the expected columns and values", () => {
    render(
      <SeasonStats
        stats={[
          {
            year: "2020 - 2021",
            team: "Chicago Blackhawks",
            games: 19,
            goals: 7,
            assists: 14,
            pim: 0,
          },
        ]}
      />
    );

    const table = screen.getByRole("table");
    const headerRow = within(table).getAllByRole("row")[0];

    expect(within(headerRow).getByText("Season")).toBeInTheDocument();
    expect(within(headerRow).getByText("Team")).toBeInTheDocument();
    expect(within(headerRow).getByText("GP")).toBeInTheDocument();
    expect(within(headerRow).getByText("G")).toBeInTheDocument();
    expect(within(headerRow).getByText("A")).toBeInTheDocument();
    expect(within(headerRow).getByText("PIM")).toBeInTheDocument();

    expect(within(table).getByText("2020 - 2021")).toBeInTheDocument();
    expect(within(table).getByText("Chicago Blackhawks")).toBeInTheDocument();
    expect(within(table).getByText("19")).toBeInTheDocument();
    expect(within(table).getByText("7")).toBeInTheDocument();
    expect(within(table).getByText("14")).toBeInTheDocument();
    expect(within(table).getByText("0")).toBeInTheDocument();
  });

  it("renders goalie seasons with formatted time, average, and save percentage", () => {
    render(
      <SeasonStats
        stats={[
          {
            year: "2005 - 2006",
            team: "Chicago Blackhawks",
            games: 2,
            wins: 1,
            losses: 0,
            ot: 3,
            timeOnIce: "86:27",
            goalsAgainst: 5,
            shotsAgainst: 41,
            goalAgainstAverage: 3.470214,
            savePercentage: 0.878049,
          },
        ]}
      />
    );

    const table = screen.getByRole("table");
    const headerRow = within(table).getAllByRole("row")[0];

    expect(within(headerRow).getByText("W")).toBeInTheDocument();
    expect(within(headerRow).getByText("L")).toBeInTheDocument();
    expect(within(headerRow).getByText("T/OT")).toBeInTheDocument();
    expect(within(headerRow).getByText("MIN")).toBeInTheDocument();
    expect(within(headerRow).getByText("GAA")).toBeInTheDocument();
    expect(within(headerRow).getByText("SV%")).toBeInTheDocument();

    expect(within(table).getByText("3")).toBeInTheDocument();
    expect(within(table).getByText("86")).toBeInTheDocument();
    expect(within(table).getByText("3.47")).toBeInTheDocument();
    expect(within(table).getByText("87.80%")).toBeInTheDocument();
  });

  it("renders goalie placeholder values when optional stats are missing", () => {
    render(
      <SeasonStats
        stats={[
          {
            year: "2005 - 2006",
            team: "Chicago Blackhawks",
            games: 1,
            wins: 1,
            losses: null,
            ties: null,
            ot: null,
            timeOnIce: null,
            goalsAgainst: null,
            shotsAgainst: null,
            goalAgainstAverage: null,
            savePercentage: null,
          },
        ]}
      />
    );

    const table = screen.getByRole("table");
    const bodyRow = within(table).getAllByRole("row")[1];
    const dashCells = within(bodyRow).getAllByText("-");

    expect(dashCells).toHaveLength(5);
  });
});
