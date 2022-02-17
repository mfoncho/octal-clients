import pattern from "./pattern";

const emphasis = ["simple", "1188"];

const sample = `\`${emphasis[0]}\` The point of reference-style links is \`\`\`not\`\`\` that they’re easier to \`${emphasis[1]}\` write`;

test("Emphasis match", () => {
    const cpattern = new RegExp(pattern, "g");
    let matched = 0;
    let match: ReturnType<typeof cpattern["exec"]> = null;
    while ((match = cpattern.exec(sample))) {
        expect(match[1]).toBe(emphasis[matched]);
        matched++;
    }
});
