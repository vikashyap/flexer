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

    expect(screen.getByText(/Flexer/i)).toBeInTheDocument();
  });
});
