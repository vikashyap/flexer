describe("Main entry", () => {
  it("mounts App without crashing", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
    await import("./main");
    expect(document.getElementById("root")).toBeTruthy();
  });
});
