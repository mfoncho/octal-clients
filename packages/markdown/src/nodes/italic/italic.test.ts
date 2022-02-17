import pattern from "./pattern";

const emphasis = ["simple", "1188", "nested trick", "asterisks"];

const sample = `_${emphasis[0]}_ The point _${emphasis[1]}_ of reference-style links is not that they’re easier to write. The point is that  _single under  _${emphasis[2]}_  with reference-style links, your document source is vastly more readable. Compare the above  *${emphasis[3]}*`;

test("Emphasis match", () => {
    const cpattern = new RegExp(pattern, "g");
    let matched = 0;
    let match: ReturnType<typeof cpattern["exec"]> = null;
    while ((match = cpattern.exec(sample))) {
        expect(match[2] ?? match[5]).toBe(emphasis[matched]);
        matched++;
    }
});
