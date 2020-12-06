import {TableLayout} from './table-layout';

export interface DocContent {
  info: { title: string, author: string, subject: string };
  header: any;
  content: TableLayout[];
}
