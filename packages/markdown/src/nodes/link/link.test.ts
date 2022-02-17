import pattern from "./pattern";

const link = "hello link";

const ref = "http://example.com";

const sample = `[${link}](${ref}) The point of reference-style links is not that they’re easier to write.`;

test("Link match", () => {
    const cpattern = new RegExp(pattern);
    let match: ReturnType<typeof cpattern["exec"]> = cpattern.exec(sample);
    expect(match).toBeTruthy();
    if (match) {
        expect(match[1]).toBe(link);
        expect(match[4]).toBe(ref);
    }
});
