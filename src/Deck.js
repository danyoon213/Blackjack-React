import React, {Component} from "react";
import axios from "axios";
import Card from "./Card";

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {deck:null, cardsDrawn: []};
    this.getCard = this.getCard.bind(this);
  }
  async componentDidMount() {
    let deck = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    this.setState({deck:deck.data})
    console.log(deck.data)
  }
  async getCard() {
    let id = this.state.deck.deck_id;

    try {
      let card = await axios.get(`https://www.deckofcardsapi.com/api/deck/${id}/draw/`);
      if(!card.data.success) {
        throw new Error("No more cards left!")
      }
      console.log(card.data)
      let cardDrawn = card.data.cards[0];
      console.log(cardDrawn)
      this.setState(state => ({
        cardsDrawn: [
          ...state.cardsDrawn,
          {
            id: cardDrawn.code,
            image: cardDrawn.image,
            name: `${cardDrawn.value} of ${cardDrawn.suit}`
          }
        ]
      }))
    } catch (err) {
      alert(err)
    }
  }
  

  render() {
    const cards = this.state.cardsDrawn.map(card => {
      return <Card key={card.id} name={card.name} image={card.image} />
    })
    return (
      <div>
        <h1>Card Dealer</h1>
        <button onClick={this.getCard}>Get New Card</button>
        {cards}
      </div>
    )
  }
}

export default Deck;