import Emoji from "./emoji";
const emojis = ["❤️", "☘️", "☪️"];

const sample = `${emojis[0]} The point _${emojis[1]}_ of reference-style links is not that they’re easier to write. The point is that  _single under with reference-style links, your document source is vastly more readable. Compare the above  *${emojis[2]}*`;

test("Emphasis match", () => {
    const span = new Emoji();
    const cpattern = new RegExp(span.pattern, "g");
    let matched = 0;
    let match: ReturnType<typeof cpattern["exec"]> = null;
    while ((match = cpattern.exec(sample))) {
        expect(match[0]).toBe(emojis[matched]);
        matched++;
    }
});
