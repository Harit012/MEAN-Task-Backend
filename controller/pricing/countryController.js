const countryModal = require("../../models/country");

exports.getCountry = async (req, res) => {
  try {
    const countries = await countryModal.find();
    res.send({ countries: countries });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};

exports.postCountry = async (req, res) => {
  if (
    !req.body.countryName ||
    !req.body.currency ||
    !req.body.countryCallCode ||
    !req.body.FlagUrl ||
    !req.body.timezones
  ) {
    res.send({ error: "Please enter all the fields" });
  } else {
    try {
      const country = new countryModal({
        countryName: req.body.countryName,
        currency: req.body.currency,
        countryCallCode: req.body.countryCallCode,
        FlagUrl: req.body.FlagUrl,
        timezones: req.body.timezones,
      });
      await country
        .save()
        .then((data) => {
          res.send({ country: data });
        })
        .catch((err) => {
          switch (err.errorResponse.code) {
            case 11000:
              res.send({
                error: `County with name ${req.body.countryName} Already Exists.`,
              });
              break;
            default:
              console.log(err);
              res.send({ error: err.message });
          }
        });
    } catch (err) {
      switch (err.errorResponse.code) {
        default:
          res.send({ error: err.message });
      }
    }
  }
};
