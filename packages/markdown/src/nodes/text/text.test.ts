import pattern from "./pattern";

const sample = `-------`;

test("Paragraph match", () => {
    let match = new RegExp(pattern).exec(sample);
    expect(match).toBeTruthy();
    if (match) expect(match[0]).toBe("-------");
});
