const howtos = require("./howto.json");
const faqs = require("./faq.json");
//=====================================================================
// GET HOW TO PLAY TIPS
//=====================================================================
exports.getHowTos = async (req, res, next) => {
  return res.json({
    status: "success",
    howtos: howtos.howto,
  });
};

exports.getQaqs = async (req, res, next) => {
  return res.json({
    status: "success",
    faqs: faqs.faqs,
  });
};
