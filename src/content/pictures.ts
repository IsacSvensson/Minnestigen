// The picture catalog: ids and Swedish names. The drawings live in src/graphics/pictures.ts.

export const PICTURES = [
  { id: 'apple', name: 'äpple' },
  { id: 'fish', name: 'fisk' },
  { id: 'key', name: 'nyckel' },
  { id: 'boat', name: 'båt' },
  { id: 'hat', name: 'hatt' },
  { id: 'sun', name: 'sol' },
  { id: 'book', name: 'bok' },
  { id: 'shoe', name: 'sko' },
  { id: 'ball', name: 'boll' },
  { id: 'cup', name: 'kopp' },
  { id: 'flower', name: 'blomma' },
  { id: 'umbrella', name: 'paraply' },
  { id: 'star', name: 'stjärna' },
  { id: 'clock', name: 'klocka' },
  { id: 'balloon', name: 'ballong' },
  { id: 'carrot', name: 'morot' },
] as const;

export type PictureId = (typeof PICTURES)[number]['id'];

export const PICTURE_IDS: readonly string[] = PICTURES.map((p) => p.id);

export function pictureName(id: string): string {
  return PICTURES.find((p) => p.id === id)?.name ?? id;
}
