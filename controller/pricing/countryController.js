const countryModal = require("../../models/country");

exports.getCountry = async (req, res) => {
  try {
    const countries = await countryModal.find();
    res.status(200).send({ status: "Success", countries: countries });
  } catch (err) {
    res
      .status(500)
      .send({
        status: "Failure",
        message: "can not get countries from server",
      });
  }
};

exports.postCountry = async (req, res) => {
  if (
    !req.body.countryName ||
    !req.body.currency ||
    !req.body.countryCallCode ||
    !req.body.FlagUrl ||
    !req.body.timezones ||
    !req.body.countryShortName
  ) {
    res.status(400).send("Please enter all the fields");
  } else {
    try {
      const country = new countryModal({
        countryName: req.body.countryName,
        currency: req.body.currency,
        countryCallCode: req.body.countryCallCode,
        FlagUrl: req.body.FlagUrl,
        timezones: req.body.timezones,
        latlng: req.body.latlng,
        countryShortName: req.body.countryShortName,
      });
      await country
        .save()
        .then((data) => {
          res.status(200).send({status:"Success", country: data });
        })
        .catch((err) => {
          console.log(err);
          switch (err.errorResponse.code) {
            case 11000:
              res
                .status(11000)
                .send({ status: "Failure", message: "Country Already Exists" });
              break;
            default:
              console.log(err);
              res
                .status(500)
                .send({
                  status: "Failure",
                  message: "can not post country in server",
                });
          }
        });
    } catch (err) {
      res
        .status(500)
        .send({ status: "Failure", message: "can not post country in server" });
    }
  }
};
