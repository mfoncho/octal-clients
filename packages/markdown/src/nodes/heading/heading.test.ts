import { parse, match } from "./heading";

const hdepth = "####";

const title = "this is the title";

const sample = `${hdepth} ${title}
* Send a video file to multiple browser in real time for perfectly synchronized movie watching.`;

const levelone = `
${title}
============
level title type;
`;

const leveltwo = `
${title}
------------
level title type;
`;

test("Heading match", () => {
    const matched = match(sample);
    expect(matched).toBeTruthy();
    if (matched) {
        expect(matched[6]).toBe(title);
        expect(`${hdepth} ${title}\n`).toBe(
            sample.substring(0, matched[0].length)
        );
    }
});

test("Parse level one heading", () => {
    const matched = match(levelone);
    expect(matched).toBeTruthy();
    if (matched) {
        const [depth, substr] = parse(matched);
        expect(depth).toBe(1);
        expect(substr).toBe(title);
    }
});

test("Parse level two heading", () => {
    const matched = match(leveltwo);
    expect(matched).toBeTruthy();
    if (matched) {
        const [depth, substr] = parse(matched);
        expect(depth).toBe(2);
        expect(substr).toBe(title);
    }
});
