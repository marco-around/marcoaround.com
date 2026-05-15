import { CanvasTexture, NearestFilter } from 'three'

export function createAsciiAtlas(
	characters: string,
	fontSize: number = 64,
): CanvasTexture {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create 2d context for ASCII Atlas");
  }

  canvas.width = fontSize * characters.length;
  canvas.height = fontSize;

  context.font = `${fontSize}px`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "white";

  for (let index = 0; index < characters.length; index++) {
    const horizontalCenter = index * fontSize + fontSize * 0.5;
    const verticalCenter = fontSize * 0.5;

    context.fillText(characters[index], horizontalCenter, verticalCenter);
  }

  const texture = new CanvasTexture(canvas);
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.premultiplyAlpha = false;

  return texture;
}