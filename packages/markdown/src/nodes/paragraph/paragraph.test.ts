import Paragraph from "./paragraph";

const sample = `Now go build something awesome! Here are some **ideas** to get your creative juices flowing:
* Send a video file to multiple browser in real time for perfectly synchronized movie watching.`;

test("Paragraph match", () => {
    const paragraph = new Paragraph();
    const match = paragraph.match(sample);
    expect(match).toBeTruthy();
    if (match) {
        const length = match[0].length;
        expect(length).toBeGreaterThan(1);
        expect(sample.split("\n")[0] + "\n").toBe(sample.substring(0, length));
    }
});
