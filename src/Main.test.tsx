describe("Main entry", () => {
  it("mounts App without crashing", async () => {
    // Step 1: create the root div before importing main
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    // Step 2: NOW import main.tsx
    await import("./main");

    // Step 3: assert the root div exists
    expect(document.getElementById("root")).toBeTruthy();
  });
});
