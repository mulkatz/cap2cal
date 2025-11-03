import Dexie, { Table } from 'dexie';
import { CaptureEvent, Img } from './CaptureEvent.ts';

export class EventDB extends Dexie {
  eventItems!: Table<CaptureEvent, string>;
  images!: Table<Img, string>;

  constructor() {
    super('EventDB');
    this.version(3).stores({
      eventItems: 'id',
      images: 'id',
    });
  }

  deleteList(eventListId: number) {
    return this.transaction('rw', this.eventItems, () => {
      this.eventItems.where({ eventListId }).delete();
    });
  }
}

export const db = new EventDB();

export function resetDatabase() {
  return db.transaction('rw', db.eventItems, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });
}
