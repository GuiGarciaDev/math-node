/* @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { Sidebar } from "./Sidebar"
import { useFlowStore } from "../flow/store/flowStore"

describe("Sidebar", () => {
  beforeEach(() => {
    useFlowStore.setState({
      appStarted: true,
      sidebarOpen: true,
    })
  })

  afterEach(() => {
    cleanup()
    useFlowStore.setState({
      sidebarOpen: true,
    })
  })

  it("renders grouped category labels and the search input in expanded mode", () => {
    render(<Sidebar collapsed={false} />)

    expect(
      screen.getByPlaceholderText("Search nodes, formulas, and actions"),
    ).toBeTruthy()
    expect(screen.getByText("Inputs")).toBeTruthy()
    expect(screen.getByText("Arithmetic")).toBeTruthy()
  })

  it("toggles sidebar state and exposes labels for collapsed icons", () => {
    useFlowStore.setState({ sidebarOpen: false })

    render(<Sidebar collapsed />)

    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }))
    expect(useFlowStore.getState().sidebarOpen).toBe(true)

    expect(screen.getByTitle("Number")).toBeTruthy()
    expect(screen.getByTitle("Constant")).toBeTruthy()
  })
})
