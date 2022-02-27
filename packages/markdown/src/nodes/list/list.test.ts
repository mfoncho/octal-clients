import { parse, match } from "./list";

const sample2 = `1. one
2)   two
4)   three`;

const sample = `*   Red
*   Green
*   Blue
-   [x] Red
-   [ ] Green
-   Blue
${sample2}`;

test("Parse heading", () => {
    let matched = match(sample);
    expect(matched).toBeTruthy();
    if (matched) {
        const [ordered, items] = parse(matched[1] ?? matched[4] ?? matched[0]);
        expect(ordered).toBe(false);
        expect(items.length).toBe(6);
        expect(items[3].checked).toBe(true);
        expect(items[4].checked).toBe(false);
    }
});

test("Parse heading", () => {
    const [ordered, items] = parse(sample2);
    expect(ordered).toBe(true);
    expect(items.length).toBe(3);
});
