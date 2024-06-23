const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.deletecard = async (req, res) => {
  // if (req.query.cardId && req.query.customerId) {
    const cardId = req.query.cardId;
    const customerId = req.query.customerId;
    try {
      await stripe.customers.deleteSource(customerId, cardId);
      res
        .status(200)
        .send({ status: "Success", message: "card deleted successfully" });
    } catch (err) {
      res.status(500).send({
        status: "Failure",
        message: "Error in deleting card from server",
      });
    }
  // } else {
  //   res
  //     .status(400)
  //     .send({
  //       status: "Failure",
  //       message: "cardId or customerId are not Provided",
  //     });
  // }
};

exports.postCard = async (req, res) => {
  var data = req.body;
  // if (data.customerId && data.token) {
    let custId = data.customerId;
    try {
      const card = await stripe.customers.createSource(custId, {
        source: data.token.id,
      });
      res.status(200).send({ status: "Success", card: card });
    } catch (err) {
      res.status(500).send({
        status: "Failure",
        message: "Error in setting default card from server",
      });
    }
  // } else {
  //   res
  //     .status(400)
  //     .send({
  //       status: "Failure",
  //       message: "cardId or customerId is not Provided",
  //     });
  // }
};

exports.setDefault = async (req, res) => {
  var data = req.body;
  // if (data.customerId && data.cardId) {
    let custId = data.customerId;
    let cardId = data.cardId;
    try {
      const card = await stripe.customers.update(custId, {
        default_source: cardId,
      });
      res.status(200).send({ Status: "Success", card: card });
    } catch (err) {
      res.status(500).send({
        status: "Failure",
        message: "Error in setting default card from server",
      });
    }
  // } else {
  //   res
  //     .status(400)
  //     .send({
  //       status: "Failure",
  //       message: "cardId or customerId is not Provided",
  //     });
  // }
};
