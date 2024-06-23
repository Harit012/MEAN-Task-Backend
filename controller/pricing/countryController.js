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
      await country.save();
      res.status(200).send({status:"Success", country: country});
       
    } catch (err) {
      console.log(err)
        console.log(err.errorResponse.code);
        console.log(typeof(err.errorResponse.code));
        if (err.errorResponse.code === 11000) {
            res
              .status(500)
              .send({ status: "Failure", message: "Country Already Exists" });
        } else {
          console.log(err.errorResponse.code);
            res
              .status(500)
              .send({
                status: "Failure",
                message: "can not post country in server",
              });
        } 
      res
        .status(500)
        .send({ status: "Failure", message: "can not post country in server" });
    }
};
