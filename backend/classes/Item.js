class Item {
  constructor(
    id = null,
    title,
    description,
    price,
    brand = null,
    category,
    condition,
    images = [],
    visibilityStatus = true,
    createdAt = new Date(),
    location,
    sellerId
  ){
     //Validate id only if it's not null
    if (id !== null && id !== undefined) {
      this._id = id;
    } else {
      // If id is null, MongoDB will handle the _id when saving
      this._id = null;
    }
     //Validate brand only if it's not null
    if (brand !== null && brand !== undefined) {
      this._brand = brand;
    } else {
      // If brand is null, MongoDB will handle the _id when saving
      this._brand = null;
    }
    this._title = title;
    this._description = description;
    this._price = price;
    this._brand = brand;
    this._category = category;
    this._condition = condition;
    this._images = images;
    this._visibilityStatus = visibilityStatus;  // Consistent naming
    this._createdAt = new Date(createdAt); // Handle invalid date gracefully
    this._location = location;
    this._sellerId = sellerId;
  }

  // Getters
  get id() {
    return this._id;
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
    return this._visibilityStatus;
  }

  get createdAt() {
    return this._createdAt;
  }

  get location() {
    return this._location;
  }

  get sellerId() {
    return this._sellerId;
  }

  // Setters with Validation
  set id(newId) {
    this._id = newId;
  }

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
    if (newImages.some(image => typeof image !== 'string' || !image.startsWith('http'))) {
      throw new Error("Each image must be a valid URL string.");
    }
    this._images = newImages;
  }

  set createdAt(newDate) {
    const date = new Date(newDate);
    if (isNaN(date.getTime())) {  // More flexible date validation
      throw new Error("Created date must be a valid Date.");
    }
    this._createdAt = date;
  }

  set location(newLocation) {
    if (!newLocation || typeof newLocation !== "string") {
      throw new Error("Location must be a valid division name.");
    }
    this._location = newLocation;
  }

  set visibilityStatus(status) {
    this._visibilityStatus = status;
  }

  set sellerId(newSellerId) {
    this._sellerId = newSellerId;
  }
}

module.exports = Item;
