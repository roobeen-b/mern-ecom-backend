const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and it must be a string",
      });
    }

    const regExp = new RegExp(keyword, "i");
    const searchQuery = {
      $or: [
        { title: regExp },
        { description: regExp },
        { category: regExp },
        { brand: regExp },
      ],
    };

    const searchResults = await Product.find(searchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { searchProducts };
