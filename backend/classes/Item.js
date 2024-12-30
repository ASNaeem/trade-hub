class Item {
  constructor(
    id,
    title,
    description,
    price,
    brand = null,
    category,
    condition,
    images = [],
    location,
    sellerId,
    createdAt = new Date()
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._price = price;
    this._brand = brand;
    this._category = category;
    this._condition = condition;
    this._images = images.map((img) => {
      if (img.type === "base64") {
        return {
          type: "base64",
          data: img.data,
          contentType: img.contentType || "image/jpeg",
          url: null,
        };
      }
      return {
        type: "url",
        url: img.url || null,
        data: null,
        contentType: img.contentType || null,
      };
    });
    this._location = location;
    this._sellerId = sellerId;
    this._createdAt = createdAt;
  }

  // Getters and Setters
  get id() {
    return this._id;
  }

  set id(newId) {
    this._id = newId;
  }

  get title() {
    return this._title;
  }

  set title(newTitle) {
    if (typeof newTitle !== "string") {
      throw new Error("Title must be a string");
    }
    this._title = newTitle;
  }

  get description() {
    return this._description;
  }

  set description(newDescription) {
    if (typeof newDescription !== "string") {
      throw new Error("Description must be a string");
    }
    this._description = newDescription;
  }

  get price() {
    return this._price;
  }

  set price(newPrice) {
    if (typeof newPrice !== "number" || newPrice < 0) {
      throw new Error("Price must be a non-negative number");
    }
    this._price = newPrice;
  }

  get brand() {
    return this._brand;
  }

  set brand(newBrand) {
    if (newBrand !== null && typeof newBrand !== "string") {
      throw new Error("Brand must be null or a string");
    }
    this._brand = newBrand;
  }

  get category() {
    return this._category;
  }

  set category(newCategory) {
    if (typeof newCategory !== "string") {
      throw new Error("Category must be a string");
    }
    this._category = newCategory;
  }

  get condition() {
    return this._condition;
  }

  set condition(newCondition) {
    if (typeof newCondition !== "string") {
      throw new Error("Condition must be a string");
    }
    this._condition = newCondition;
  }

  get images() {
    return this._images;
  }

  set images(newImages) {
    if (!Array.isArray(newImages)) {
      throw new Error("Images must be an array");
    }
    this._images = newImages;
  }

  get location() {
    return this._location;
  }

  set location(newLocation) {
    if (typeof newLocation !== "string") {
      throw new Error("Location must be a string");
    }
    this._location = newLocation;
  }

  get sellerId() {
    return this._sellerId;
  }

  set sellerId(newSellerId) {
    if (typeof newSellerId !== "string") {
      throw new Error("Seller ID must be a string");
    }
    this._sellerId = newSellerId;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(newCreatedAt) {
    if (!(newCreatedAt instanceof Date)) {
      throw new Error("Created At must be a Date object");
    }
    this._createdAt = newCreatedAt;
  }

  validate() {
    if (!this._title || typeof this._title !== "string") {
      throw new Error("Title is required and must be a string");
    }
    if (!this._description || typeof this._description !== "string") {
      throw new Error("Description is required and must be a string");
    }

    if (!this._price || typeof this._price !== "number" || this._price <= 0) {
      throw new Error("Price is required and must be a positive number");
    }

    if (!Array.isArray(this._images) || this._images.length === 0) {
      throw new Error("At least one image is required");
    }

    if (!this._location || typeof this._location !== "string") {
      throw new Error("Location is required and must be a string");
    }

    if (!this._sellerId || typeof this._sellerId !== "string") {
      throw new Error("Seller ID is required and must be a string");
    }

    if (!this._createdAt || !(this._createdAt instanceof Date)) {
      throw new Error("Created At is required and must be a Date object");
    }
    return true;
  }

  getSummary() {
    return {
      _id: this._id,
      title: this._title,
      description: this._description,
      price: this._price,
      brand: this._brand,
      category: this._category,
      condition: this._condition,
      images: this._images.map((img) => {
        if (img.type === "base64") {
          return {
            type: "base64",
            data: img.data,
            contentType: img.contentType,
            url: null,
          };
        }
        return {
          type: "url",
          url: img.url,
          data: null,
          contentType: img.contentType,
        };
      }),
      location: this._location,
      sellerId: this._sellerId,
      createdAt: this._createdAt,
    };
  }
}

module.exports = Item;
