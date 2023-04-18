import uniqid from "uniqid";
export default class list {
  constructor() {
    this.items = [];
  }
  deleteItem(id) {
    //id gedeg IDtei ortsiin indeksiig massivaas hailj olno.
    const index = this.items.findIndex((el) => el.id === id);
    // ug indeks deerh elmentiig massivaas ustgana.
    this.items.splice(index, 1);
  }
  additem(item) {
    let newItem = {
      id: uniqid(),
      item,
    };
    this.items.push(newItem);
    return newItem;
  }
}
