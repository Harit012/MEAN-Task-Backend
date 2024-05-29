const cardModel = require("../../models/card");
const userModel = require("../../models/user");

exports.postCard = async (req, res) => {
    const data = req.body;
    let cardHolderName = data.cardHolderName;
    cardHolderName = cardHolderName.toUpperCase();
  try {
    const card = new cardModel({ 
        cardNumber: data.cardNumber,
        cardHolderName: cardHolderName,
        expiryDate: data.expiryDate,
        cvv: data.cvv
     });
    card.save();
    await userModel.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { cards: card._id } }
    )
    res.send({ card: card });
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.deletecard = async (req, res) => {
  const cardId = req.query.cardId;
  const userId = req.query.userId;
  try {
    await cardModel.findOneAndDelete({ _id: cardId });
    await userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { cards: cardId } }
    );
    res.send({ message: "card deleted successfully" });
  }catch(err){
    res.send({error:err.message})
  }
}
