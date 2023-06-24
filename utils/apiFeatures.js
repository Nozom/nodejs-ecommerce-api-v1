class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    // 1) Filtering
    const fiterQueryString = { ...this.queryString };
    const excludeFields = ["limit", "page", "sort", "fields"];
    excludeFields.forEach((field) => {
      return delete fiterQueryString[field];
    });

    // Apply Filtering with [gte , gt , lte , lt]
    let queryStr = JSON.stringify(fiterQueryString);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  paginate(countDocuments) {
    //countDocuments=> all documents in db
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }

  sort() {
    //   3 ) sorting
    const { sort } = this.queryString;
    if (sort) {
      const sortby = sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortby);
      return this;
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createAt");
    }
    return this;
  }

  fields() {
    // 4 ) fields
    const { fields } = this.queryString;
    if (fields) {
      const fieldsby = fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fieldsby);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
        console.log(query);
      } else {
          query = { name: { $regex: this.queryString.keyword, $options: "i" } };
        console.log(query);
          
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  populate() {
    // 5) populate
    const { populate } = this.queryString;
    if (populate) {
      this.mongooseQuery = this.mongooseQuery.populate(populate);
    }
    return this;
  }
}

module.exports = ApiFeatures;
