import pattern from "./pattern";
import Emphasis from "./emphasis";

const emphasis = ["simple", "1188", "nested **trick same** day", "asterisks"];

const sample = `_${emphasis[0]}_ The point _${emphasis[1]}_ of reference-style links is not that they’re easier to write. The point is that  single under  _${emphasis[2]}_  with reference-style links, your document source is vastly more readable. Compare the above  *${emphasis[3]}*`;

test("Emphasis pattern", () => {
    const cpattern = new RegExp(pattern, "g");
    let matched = 0;
    let match: ReturnType<typeof cpattern["exec"]> = null;
    while ((match = cpattern.exec(sample))) {
        expect(match[3] ?? match[8]).toBe(emphasis[matched]);
        matched++;
    }
});

test("Emphasis component", () => {
    const emphasis = new Emphasis();
    const doc = "test one _this match __with__ _all  this_ abcde";
    const match = emphasis.match(doc);
    if (match) console.log(match, doc.substring(match.index, match.length));
});
