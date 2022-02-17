import { parse } from "./blockquote";

const sample = `> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> 
> id sem consectetuer libero luctus adipiscing.`;

test("Parse blockquote", () => {
    const substr = parse(sample);
    expect(substr).toBe(
        sample
            .split("\n")
            .map((line) => line.split("> ").slice(1).join("> ").trim())
            .join("\n")
            .trim()
    );
});
