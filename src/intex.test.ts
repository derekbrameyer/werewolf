import { werewolf, villager, seer } from './cards'
import {
  // generateAllCards,
  // makeDeck,
  getDeckWeight,
  // getCardPerceivedWeight,
  // getDeckRoles,
  // getNumberOfARoleInDeck,
} from './index'
// import { all, whereEq } from 'ramda'

describe('Helper Functions', () => {
  it('getDeckWeight: calculates the given deck weight', () => {
    expect(getDeckWeight([werewolf, werewolf, werewolf, villager])).toBe(-17)
    expect(getDeckWeight([werewolf, villager, seer])).toBe(2)
  })

  // it('getDeckPreferences: Aggregates the preferences of a deck', () => {
  //   expect(
  //     getDeckPreferences([
  //       getCard('mason'),
  //       getCard('seer'),
  //       getCard('villager'),
  //     ])
  //   ).toEqual(['mason'])
  // })

  // it('getDeckAvoids: Aggregates the preferences of a deck', () => {
  //   expect(
  //     getDeckAvoids([
  //       Card({ avoids: ['villager'] }),
  //       Card({ avoids: ['villager'] }),
  //       Card({ avoids: ['villager'] }),
  //     ])
  //   ).toEqual(['villager'])

  //   expect(
  //     getDeckAvoids([
  //       Card({ avoids: ['villager'] }),
  //       Card({ avoids: ['werewolf'] }),
  //       Card({ avoids: ['seer'] }),
  //     ])
  //   ).toEqual(['villager', 'werewolf', 'seer'])
  // })

  // it('getNumberOfARoleInDeck: Sums all of a given role in a deck', () => {
  //   const deck = [
  //     getCard('villager'),
  //     getCard('villager'),
  //     getCard('seer'),
  //     getCard('villager'),
  //     getCard('mason'),
  //   ]
  //   expect(getNumberOfARoleInDeck('villager', deck)).toEqual(3)
  //   expect(getNumberOfARoleInDeck('seer', deck)).toEqual(1)
  // })

  // it('getDeckRoles: Aggregate all the roles in the deck', () => {
  //   const deck = [
  //     getCard('villager'),
  //     getCard('villager'),
  //     getCard('werewolf'),
  //     getCard('seer'),
  //     getCard('villager'),
  //   ]
  //   expect(getDeckRoles(deck)).toEqual(['villager', 'werewolf', 'seer'])
  // })

  // it('getCardPerceivedWeight', () => {
  //   const deck = [
  //     getCard('villager'),
  //     getCard('werewolf'),
  //     getCard('seer'),
  //     getCard('mason'),
  //   ]
  //   const testCard = getCardPerceivedWeight(0, 10, deck)

  //   // TODO: This test is wrong, I don't know what the result should be
  //   expect(testCard(getCard('werewolf'))).toEqual(7)
  // })
})

// TODO: Make this a test helper... or include ramda.
// const containsRole = (role, cards) => {
//    return cards.contains((card) => card.role === role);
// }
// describe('makeDeck', () => {
//   it('properly generates all the cards', () => {
//     const deck = generateAllCards([getCard('mason')])
//     expect(deck.length).toBe(3)
//     expect(all(whereEq({ role: 'mason' }), deck)).toBe(true)
//   })

// TL: Does it though? If you had a lot of card options, some will get
//     excluded for balance?
// it('makes the largest deck it can given the number of cards', () => {
//   const deck = makeDeck(1, 0, [Card({ role: 'werewolf' })])
//   expect(deck.length).toBe(1)
//   // expect(any(whereEq({role: 'werewolf'}))

//   const biggerDeck = makeDeck(10, 0, [
//     Card({ role: 'werewolf', cardCount: 3 }),
//     Card({ role: 'villager', cardCount: 2 }),
//     Card({ role: 'seer', cardCount: 1 }),
//   ])

//   expect(biggerDeck.length).toBe(6)
// })

//
// describe('getPerceivedWeight', () => {
//   it('does the thing', () => {
//     expect(true).toEqual(true)
//   })
/**  */
//   it('gets the correct perceived weight', () => {
//     const deckSize = 12
//     const initialCards: Card[] = [
//       Card('werewolf'),
//       Card('villager'),
//       Card('seer'),
//     ]
//
//     const deck = makeDeck(deckSize, initialCards)
//     const card = Card('werewolf')
//     const weight = getPerceivedWeight(deck, card)
//
//     expect(weight).toBe(5)
//   })
// })
// lol
