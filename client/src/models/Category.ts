
export class Category {
  id: string
  name: string
  desc: string
  imageLink: string

  constructor (
    id: string,
    name: string,
    desc: string,
    imageLink: string
  ) {
    this.id = id
    this.name = name
    this.desc = desc
    this.imageLink = imageLink
  }

  static fromArray(categories: any[]) {
    return categories.map(category => new Category(
      category._id,
      category.name,
      category.desc,
      category.imageLink
    ))
  }
}