class Item {
  constructor(
    item_id,
    title,
    description,
    price,
    brand,
    category,
    condition,
    images = [],
    visibility_status = "visible",
    created_at = new Date(),
    location
  ) {
    this._item_id = item_id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.brand = brand;
    this.category = category;
    this.condition = condition;
    this.images = images;
    this.visibilityStatus = visibility_status; // String expected
    this.createdAt = created_at;
    this.location = location;
  }

  // Getters
  get itemId() {
    return this._item_id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get price() {
    return this._price;
  }

  get brand() {
    return this._brand;
  }

  get category() {
    return this._category;
  }

  get condition() {
    return this._condition;
  }

  get images() {
    return this._images;
  }

  get visibilityStatus() {
    return this._visibility_status;
  }

  get createdAt() {
    return this._created_at;
  }

  get location() {
    return this._location;
  }

  // Setters with Validation
  set title(newTitle) {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error("Title cannot be empty.");
    }
    this._title = newTitle;
  }

  set description(newDescription) {
    if (newDescription && newDescription.trim().length > 500) {
      throw new Error("Description cannot exceed 500 characters.");
    }
    this._description = newDescription;
  }

  set price(newPrice) {
    if (newPrice <= 0) {
      throw new Error("Price must be greater than 0.");
    }
    this._price = newPrice;
  }

  set brand(newBrand) {
    this._brand = newBrand;
  }

  set category(newCategory) {
    this._category = newCategory;
  }

  set condition(newCondition) {
    const validConditions = ["New", "Used", "Refurbished"];
    if (!validConditions.includes(newCondition)) {
      throw new Error(
        `Condition must be one of: ${validConditions.join(", ")}`
      );
    }
    this._condition = newCondition;
  }

  set images(newImages) {
    if (!Array.isArray(newImages)) {
      throw new Error("Images must be an array.");
    }
    this._images = newImages;
  }

  set createdAt(newDate) {
    if (!(newDate instanceof Date)) {
      throw new Error("Created date must be a valid Date object.");
    }
    this._created_at = newDate;
  }

  set location(newLocation) {
    if (!newLocation || typeof newLocation !== "string") {
      throw new Error("Location must be a valid division name.");
    }
    this._location = newLocation;
  }
  set visibilityStatus(status) {
    const validStatuses = ["visible", "hidden"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Visibility status must be one of: ${validStatuses.join(", ")}`);
    }
    this._visibility_status = status;
  }



  // Set visibility from boolean
  static fromBooleanVisibility(isVisible) {
    return isVisible ? "visible" : "hidden";
  }

  // Convert visibility to boolean
  static toBooleanVisibility(status) {
    return status === "visible";
  }
}



module.exports = Item;
