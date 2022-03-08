import pattern from "./pattern";

const bolds = ["simple", "_1188_", "nested trick", "asterisks"];

const sample = `__${bolds[0]}__ The point __${bolds[1]}__ of reference-style links is not that they’re easier to write. The point is that  _single under  __${bolds[2]}__  with reference-style links, your document source is vastly more readable. Compare the above  **${bolds[3]}**`;

test("Emphasis match", () => {
    const cpattern = new RegExp(pattern, "g");
    let matched = 0;
    let match: ReturnType<typeof cpattern["exec"]> = null;
    while ((match = cpattern.exec(sample))) {
        expect(match[2] ?? match[5]).toBe(bolds[matched]);
        matched++;
    }
});
