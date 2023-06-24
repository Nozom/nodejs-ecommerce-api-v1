const router = require("express").Router();

const {
  getBrands,
  createBrands,
  getBrand,
  updateBrands,
  deleteBrand,
} = require("../controller/brandController");

router.route("/").get(getBrands).post(createBrands);

router.route("/:id").get(getBrand).put(updateBrands).delete(deleteBrand);

module.exports = router;
//hhhhh
