import { RootProviders } from "@/components/app/context/rootProviders";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Main", () => {
  it("renders without crashing", () => {
    render(
      <RootProviders>
        <App />
      </RootProviders>
    );

    // Now assert something visible on screen.
    // Example: maybe the App has a heading like "Welcome" or something basic.

    expect(screen.getByText(/Flexer/i)).toBeInTheDocument();
  });
});
