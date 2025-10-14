export class CategoryModel {
  id: number;
  name: string;
  icon?: string;
  description?: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
