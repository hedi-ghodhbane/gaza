'use client';
import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import clsx from 'clsx';

const ANIMATION_DURATION = 800;

type Card = {
  id: number;
  name: string;
  value: string;
  image: string;
}
const cardsData: Card[] = [
  { id: 1, name: 'card1', value: '1', image: '/10.jpg' },
  { id: 2, name: 'card2', value: '1', image: '/10.jpg' },
  { id: 3, name: 'card3', value: '2', image: '/2.jpg' },
  { id: 4, name: 'card4', value: '2', image: '/2.jpg' },
  { id: 5, name: 'card5', value: '3', image: '/3.jpg' },
  { id: 6, name: 'card6', value: '3', image: '/3.jpg' },
  { id: 7, name: 'card7', value: '4', image: '/15.jpg' },
  { id: 8, name: 'card8', value: '4', image: '/15.jpg' },
  { id: 9, name: 'card9', value: '5', image: '/16.jpg' },
  { id: 10, name: 'card10', value: '5', image: '/16.jpg' },
  { id: 11, name: 'card11', value: '6', image: '/7.jpg' },
  { id: 12, name: 'card12', value: '6', image: '/7.jpg' },
  { id: 13, name: 'card13', value: '7', image: '/8.jpg' },
  { id: 14, name: 'card14', value: '7', image: '/8.jpg' },
  { id: 15, name: 'card15', value: '8', image: '/9.jpg' },
  { id: 16, name: 'card16', value: '8', image: '/9.jpg' },
]
function shuffle(array: Card[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return [...array];
}
const playSound = (src: string) => {
  try {
    const audio = new Audio(`/sounds/${src}`);
    audio.volume = 0.2
    audio.play();
  } catch (error) {
    console.error(error);
  }
}
export default function Home() {
  // State for cards, flipped cards, matched cards, and the current card pair
  const [cards, setCards] = React.useState<Card[]>([]);

  const [flippedIds, setFlippedIds] = React.useState<number[]>([]);
  const [matchedIds, setMatchedIds] = React.useState<number[]>([]);
  const [currentCard, setCurrentCard] = React.useState<Card | undefined>();
  const [lastMatchedBg, setLastMatchedBg] = React.useState<string | undefined>();
  useEffect(() => {
    if (!currentCard) return;
    playSound('bomb.mp3')
  }, [currentCard]);
  // Function to handle clicks on the front of the card
  const handleFrontClick = (card: Card) => {
    console.log(card, currentCard)
    if (matchedIds.length === cards.length) {
      return;
    }
    if (matchedIds.includes(card.id)) return;
    playSound('flipcard-91468.mp3')
    setFlippedIds((current) => [...current, card.id])
    if (currentCard?.id === card.id) {
      setCurrentCard(undefined);
      return;
    };
    setCurrentCard(card);
    if (currentCard?.value === card.value) {
      setMatchedIds((current) => [...current, card.id, currentCard.id])
      setLastMatchedBg(card.image);
      setCurrentCard(undefined);
      playSound('success.mp3');
    } else if (currentCard && currentCard?.value !== card.value) {
      playSound('fail.mp3');
      setCurrentCard(undefined)
      setTimeout(() => {
        setFlippedIds((current) => current.filter(id => id !== currentCard?.id && id !== card.id))
      }, ANIMATION_DURATION)
    }

  };

  // Function to handle clicks on the back of the card (optional)
  const handleBackClick = (card: Card) => {
    if (matchedIds.includes(card.id)) return;
    if (currentCard?.id === card.id) {
      setCurrentCard(undefined);
    };
    setFlippedIds((current) => current.filter(id => id !== card.id))
  };

  // Function to check if a card is flipped or matched
  const isCardFlipped = (card: Card) => flippedIds.includes(card.id) || matchedIds.includes(card.id);

  if (cards.length === 0) return <div
    style={{
      background: `url(bg.jpeg) no-repeat center center`,
      backgroundSize: '100% 100%',
    }}
    className='min-h-screen flex-col gap-8 w-full flex items-center justify-center px-24 py-4'>
    <h1 className='py-2 bg-black bg-opacity-50 text-3xl text-center'>We're sorry for the images - but this is what Gaza's children are facing everyday! They are being murdered without any mercy!</h1>
    <button className='text-3xl bg-white rounded-lg shadow-md shadow-black hover:shadow-red-500 text-black py-2 px-4' onClick={() => setCards(shuffle([...cardsData]))}>Start the game</button>
  </div>;
  return (
    <main
      className="flex min-h-screen items-start justify-center pt-32">
      <video className='absolute inset-0 w-full' autoPlay loop>
        <source src='video.mp4' type='video/mp4' />
      </video>
      <AnimatePresence>
        {lastMatchedBg && <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          src={lastMatchedBg} className='absolute left-20 top-[20%] bottom-0 w-96 h-96 z-20 rounded-lg shadow-md shadow-red-400' />}
      </AnimatePresence>
      <div
        className="grid grid-cols-4 grid-rows-8 gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className={clsx("w-32 h-32 relative rounded-lg hover:shadow-white hover:shadow-sm cursor-pointer overflow-hidden", {
              'opacity-80 border-2 ring-2 ring-green-400': matchedIds.includes(card.id)
            })}>
            <motion.div
              onClick={() => handleFrontClick(card)}
              style={{ backgroundImage: `url(bg.jpeg)`, backgroundSize: 'cover', backgroundPosition: 'center center' }}
              className="absolute w-full h-full backface-hidden"
              initial={false}
              transition={{ duration: ANIMATION_DURATION / 1000 }}
              animate={{
                rotateY: isCardFlipped(card) ? 180 : 0
              }}
            />
            <motion.div
              initial={false}
              transition={{ duration: ANIMATION_DURATION / 1000 }}
              onClick={() => handleBackClick(card)}
              animate={{ rotateY: isCardFlipped(card) ? 0 : 180 }}
              style={{
                background: `url(${card.image}) no-repeat center center`,
                backgroundSize: '100% 100%',
              }}
              className="backface-hidden absolute w-full h-full"
            />
          </div>

        ))}
      </div>
    </main>
  );
}
