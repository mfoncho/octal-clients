import Mention from "./mention";
const mentions = [
    "#3a781606-a1ba-4d22-b014-f4471ef9569b",
    "@5ede3de0-8c9d-11ec-8af6-69dd8e8da4ab",
    "@5ede3de0-8c9d-11ec-8af6-69de8e8da4ab",
];

const sample = `${mentions[0]} The point _${mentions[1]}_ of reference-style links is not that they’re easier to write. The point is that  _single under with reference-style links, your document source is vastly more readable. Compare the above  *${mentions[2]}*`;

test("Emphasis match", () => {
    const span = new Mention();
    const cpattern = new RegExp(span.pattern, "g");
    let matched = 0;
    let match: ReturnType<typeof cpattern["exec"]> = null;
    while ((match = cpattern.exec(sample))) {
        expect(match[0]).toBe(mentions[matched]);
        matched++;
    }
});
