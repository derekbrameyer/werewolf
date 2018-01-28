import { repeat, reduce, uniq, contains, flatten, curry } from 'ramda'
import { Card, Roles } from 'cards'

// All the cards duplicated out into an array
export const generateAllCards = reduce<Card, Card[]>(
  (acc, card) => [...acc, ...repeat(card, card.cardCount)],
  []
)

// const allCards = generateAllCards(allCardTypes)

/** TODO:
  @param deckSize: How many cards you want in the completed deck.
  @param weight: Which direction you want the deck balanced towards
  @param initialCards: Cards you want to be in the final deck
*/
export const makeDeck = (
  deckSize: number,
  weight: number,
  initialCards: Card[],
  setOfAllCards: Card[]
): Card[] => {
  return [...initialCards]
}

// ================
// HELPER FUNCTIONS
// ================
export const getDeckWeight = (deck: Card[]): number =>
  reduce<Card, number>(
    (totalWeight, card) => totalWeight + card.weight,
    0,
    deck
  )

export const getDeckRoles = (deck: Card[]): Roles[] =>
  uniq(deck.map(c => c.role))

export const getNumberOfARoleInDeck = (role: Roles, deck: Card[]): number =>
  reduce((acc, c) => (c.role === role ? acc + 1 : acc), 0, deck)

/**
How to find a card's perceived weight relative to a deck (the higher the number, the more desireable):
- Find the current weight of the deck
- Take the card's absolute default weight (eg: werewolf has a weight of -6, so |-6| = 6
- If number of this card in the deck exceeds max, set to -1 (un-addable)
- Add to the cards weight IF
  - Any card already in the dek prefer this cards
  - This card prefers any card already in the deck
  - QUESTION (J): ^ are these two the same thing?
- Remove some of the weight IF
  - Any card already in the deck avoids this card
  - This card avoids any card already in the deck

Other wishlists:
- The algorithm starts with heavy cards and fills in with smaller Cards
- You can seed a starter deck and have the algorithm finish it for you,
for example I want a seer in the game, so i select that, and this will
more cards to make it balanced

Brain Dump:
A card is valuable if...
*/

export const getCardPerceivedWeight = curry(
  (
    targetWeight: number,
    deckSize: number,
    deck: Card[],
    card: Card
  ): number => {
    let weight = Math.abs(card.weight)

    const deckWeight = getDeckWeight(deck)
    const cardCount = getNumberOfARoleInDeck(card.role, deck)

    if (cardCount > card.cardCount) return -1

    // Does any card already in the deck prefer this card?
    const anyPreferMe = contains(card.role, getDeckPreferences(deck))
    // TODO: Does this card prefer any card already in the deck?
    const iPreferAny = false

    if (anyPreferMe || iPreferAny) {
      // QUESTION/TODO: Correct way to "add to the cards weight"
      return weight + 1
    }

    // Does any card already in the deck prefer this card?
    const anyAvoidMe = contains(card.role, getDeckAvoids(deck))
    // TODO: Does this card prefer any card already in the deck?
    const iAvoidAny = false

    if (anyAvoidMe || iAvoidAny) {
      // QUESTION/TODO: Correct way to "remove some of the cards weight"
      return weight - 1
    }

    return 5
  }
)
