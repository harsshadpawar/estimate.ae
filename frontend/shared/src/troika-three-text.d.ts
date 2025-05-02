declare module 'troika-three-text' {
  import { Mesh } from 'three';

  export class Text extends Mesh {
    text: string;
    fontSize: number;
    sync(callback?: () => void): void;
    anchorX: string;
    anchorY: string;
    textRenderInfo: { blockBounds: number[] };
  }
}
