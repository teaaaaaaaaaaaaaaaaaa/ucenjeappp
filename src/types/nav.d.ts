export interface NavItem {
  id: number;
  title: string;
  url: string;
  order: number;
  parentId: number | null;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
} 