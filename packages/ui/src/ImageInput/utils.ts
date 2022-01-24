interface ISize {
    width: number;
    height: number;
}

interface ICrop extends ISize {
    x: number;
    y: number;
}

const createImage = (url: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });
};

const defaultSize = { width: 300, height: 300 };

export async function cropImage(
    src: string,
    crop: ICrop,
    size: ISize = defaultSize
) {
    const { width, height } = size;
    const image = await createImage(src);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    ctx.imageSmoothingEnabled = true;
    (ctx as any).mozImageSmoothingEnabled = true;
    (ctx as any).webkitImageSmoothingEnabled = true;
    (ctx as any).msImageSmoothingEnabled = true;

    canvas.width = width; // pixelCrop.width;
    canvas.height = height; //pixelCrop.height;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        width,
        height
    );

    return new Promise<Blob>((resolve) => {
        canvas.toBlob((file) => resolve(file!), "image/jpeg");
    });
}
