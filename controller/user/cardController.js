const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.deletecard = async (req, res) => {
  const cardId = req.query.cardId;
  const customerId = req.query.customerId;
  try {
    await stripe.customers.deleteSource(customerId, cardId);
    res.send({ message: "card deleted successfully" });
  }catch(err){
    res.send({error:err.message})
  }
}

exports.postCard = async (req, res) => {
  const data = req.body;
  let custId = data.customerId;
  try {
    const card = await stripe.customers.createSource(custId, {
      source: data.token.id
    });
    res.send({ card: card });
  } catch (err) {
    res.send({ error: err.message });
  }
}

exports.setDefault = async (req, res) => {
  const data = req.body;
  let custId = data.customerId;
  let cardId = data.cardId;
  try {
    const card = await stripe.customers.update(custId, {
      default_source: cardId
    });
    res.send({ card: card });
  } catch (err) {
    res.send({ error: err.message });
  }
}