// eslint-disable-next-line import/no-cycle
import { Subject } from './subject.interface';

/**
 * The Observer interface declares the update method, used by subjects.
 */
export interface Observer {
  // Receive update from subject.
  update(subject: Subject, payload: any): void;
}
