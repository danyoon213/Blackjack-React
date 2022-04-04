import React, { Component } from "react";
import axios from "axios";
import Card from "./Card";

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      cardsDrawn: [],
      playerHand: [],
      playerNum: 0,
      dealerHand: [],
      gameState: "start",
    };
    this.getCard = this.getCard.bind(this);
    this.startGame = this.startGame.bind(this);
    this.calculate = this.calculate.bind(this);
  }

  async componentDidMount() {
    let deck = await axios.get(
      "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
    );
    this.setState({ deck: deck.data });
    console.log(deck.data);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   let playerTotal = this.state.playerHand.map((card) => {
  //     return this.calculate(card.value);
  //   });
  //   if (playerCards.length > 1) {
  //     playerTotal.reduce((prev, curr) => {
  //       let aces = 0;
  //       if (curr === 11) {
  //         aces++;
  //       }
  //       let total = prev + curr;
  //       if (total > 21 && aces > 0) {
  //         total = total - 10;
  //         aces--;
  //       }
  //       return total;
  //     }
  //   }
  // }

  async getCard() {
    let id = this.state.deck.deck_id;
    try {
      let card = await axios.get(
        `https://www.deckofcardsapi.com/api/deck/${id}/draw/`
      );
      if (!card.data.success) {
        throw new Error("No more cards left!");
      }
      console.log(card.data);
      let cardDrawn = card.data.cards[0];
      console.log(cardDrawn);
      this.setState((state) => ({
        cardsDrawn: [
          ...state.cardsDrawn,
          {
            id: cardDrawn.code,
            image: cardDrawn.image,
            name: `${cardDrawn.value} of ${cardDrawn.suit}`,
            value: cardDrawn.value,
          },
        ],
        playerHand: [
          ...state.playerHand,
          {
            id: cardDrawn.code,
            image: cardDrawn.image,
            name: `${cardDrawn.value} of ${cardDrawn.suit}`,
            value: cardDrawn.value,
          },
        ],
      }));
    } catch (err) {
      alert(err);
    }
  }

  calculate(value) {
    if (value === "KING" || value === "QUEEN" || value === "JACK") {
      return 10;
    }
    if (value === "ACE") {
      return 11;
    }
    return Number(value);
  }

  render() {
    const allCards = this.state.cardsDrawn.map((card) => {
      return <Card key={card.id} name={card.name} image={card.image} />;
    });
    const playerCards = this.state.playerHand.map((card) => {
      return <Card key={card.id} name={card.name} image={card.image} />;
    });
    const dealerCards = this.state.dealerHand.map((card) => {
      return <Card key={card.id} name={card.name} image={card.image} />;
    });
    let playerTotal = this.state.playerHand.map((card) => {
      return this.calculate(card.value);
    });

    return (
      <div>
        <h1>DEALER</h1>
        {dealerCards}
        <h1>All Cards in Play</h1>
        {allCards}
        <h1>Player Cards</h1>
        {playerCards}

        <button onClick={this.getCard}>Get Card</button>
        {playerCards.length > 1 ? (
          <div>
            Player's Current Total is:
            {playerTotal.reduce((prev, curr) => {
              let aces = 0;
              if (curr === 11) {
                aces++;
              }
              let total = prev + curr;
              if (total > 21 && aces > 0) {
                total = total - 10;
                aces--;
              }
              return total;
            })}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default Deck;
