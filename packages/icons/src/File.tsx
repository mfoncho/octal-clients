import React from "react";
import {
    BsFillFileEarmarkBinaryFill as DefaultFileIcon,
    BsFillFileEarmarkMusicFill as AudioFileIcon,
    BsFillFileEarmarkWordFill as WordFileIcon,
    BsFillFileEarmarkZipFill as ArchiveFileIcon,
    BsFillFileEarmarkPdfFill as PdfFileIcon,
    BsFillFileEarmarkFontFill as TextFileIcon,
    BsFillFileEarmarkImageFill as ImageFileIcon,
    BsFileEarmarkCodeFill as SourceFileIcon,
    BsFileEarmarkBarGraphFill as CvsFileIcon,
    BsFillFileEarmarkPlayFill as VideoFileIcon,
    BsFileEarmarkExcelFill as XelFileIcon,
    BsFileEarmarkPptFill as PowerPointFileIcon,
} from "react-icons/bs";

const extmap = {
    default: DefaultFileIcon,
    png: ImageFileIcon,
    jpg: ImageFileIcon,
    gif: ImageFileIcon,
    jpeg: ImageFileIcon,
    doc: WordFileIcon,
    docx: WordFileIcon,
    xlx: XelFileIcon,
    ppt: PowerPointFileIcon,
    pptx: PowerPointFileIcon,
    cvs: CvsFileIcon,
    md: TextFileIcon,
    txt: TextFileIcon,
    pdf: PdfFileIcon,
    zip: ArchiveFileIcon,
    gzip: ArchiveFileIcon,
    tar: ArchiveFileIcon,
    "7zip": ArchiveFileIcon,
    c: SourceFileIcon,
    py: SourceFileIcon,
    go: SourceFileIcon,
    js: SourceFileIcon,
    exs: SourceFileIcon,
    el: SourceFileIcon,
    rb: SourceFileIcon,
    cpp: SourceFileIcon,
    h: SourceFileIcon,
    hb: SourceFileIcon,
    hh: SourceFileIcon,
    mp3: AudioFileIcon,
    ogg: AudioFileIcon,
    mp4: VideoFileIcon,
    av1: VideoFileIcon,
};

const ICONS = new Map(
    Object.keys(extmap).map((key) => [key, extmap[key as keyof typeof extmap]])
);

export interface IFileIcon {
    className?: string;
    type?: string;
    ext?: string;
}

export default function FileIcon({
    ext = "",
    type = "",
    className,
}: IFileIcon) {
    let Icon = ICONS.get(ext);
    if (Icon) return <Icon className={className} />;

    Icon = ICONS.get(type);
    if (Icon) return <Icon className={className} />;

    Icon = ICONS.get("default")!;
    return <Icon className={className} />;
}
