import pattern from "./pattern";

const bolds = ["simple", "1188~", "nested trick", "asterisks"];

const sample = `~~${bolds[0]}~~ The point ~~${bolds[1]}~~ of reference-style links is not that they’re easier to write. The point is that  _single under  ~~${bolds[2]}~~  with reference-style links, your document source is vastly more readable. Compare the above  ~~${bolds[3]}~~`;

test("Emphasis match", () => {
    const cpattern = new RegExp(pattern, "g");
    let matched = 0;
    let match: ReturnType<typeof cpattern["exec"]> = null;
    while ((match = cpattern.exec(sample))) {
        expect(match[1]).toBe(bolds[matched]);
        matched++;
    }
});
