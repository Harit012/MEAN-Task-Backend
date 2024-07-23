const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.deletecard = async (req, res) => {
    const cardId = req.query.cardId;
    const customerId = req.query.customerId;
    try {
      await stripe.customers.deleteSource(customerId, cardId);
      res
        .status(200)
        .send({ success: true, message: "card deleted successfully" });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "Error in deleting card from server",
      });
    }
};

exports.postCard = async (req, res) => {
  var data = req.body;
    let custId = data.customerId;
    try {
      const card = await stripe.customers.createSource(custId, {
        source: data.token.id,
      });
      res.status(200).send({ success: true, card: card });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "Error in setting default card from server",
      });
    }
};

exports.setDefault = async (req, res) => {
  var data = req.body;
    let custId = data.customerId;
    let cardId = data.cardId;
    try {
      const card = await stripe.customers.update(custId, {
        default_source: cardId,
      });
      res.status(200).send({ success: true, card: card });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "Error in setting default card from server",
      });
    }
};
