import React, { useEffect, useRef, useState } from 'react';
import STAR_ICON_URL from './assets/icon_star.webp'
import bluestar from './assets/bluestar.webp'
import RetroCard from './RetroCard';
import ImageLinkIcon from './ImageLinkIcon';
import ICON_DATA from './ICON_DATA';
import thisMuch from './assets/this.gif'
import sunshine from './assets/sunshine.png'
import moon from './assets/luna.webp'
import useHoverSound from './useHoverSound';
import toggleMusic from './MusicToggle';
import Wave from 'react-wavify'
import benenegif from './assets/benenegif.gif'



// -----------------------------------------------------------------------------
// APP - multi-window with center main card
// -----------------------------------------------------------------------------
const App = () => {
  const playQuack = useHoverSound('/mac-quack.mp3', 1);
  const playPop = useHoverSound('/pop.mp3',1)

  const [openCards, setOpenCards] = useState([]);
  const [zIndexes, setZIndexes] = useState({});
  const topZRef = useRef(1000);

  // center container using flexbox (no JS-based centering)
  // main card initial position will be computed relative to viewport center
  // Compute main card position so it's always centered
const [mainInitial, setMainInitial] = useState(() => ({
  x: Math.round(window.innerWidth / 2 - 800 / 2), // width of main card = 420
  y: Math.round(window.innerHeight / 2 - 500 / 2), // height of main card = 300
}));

useEffect(() => {
  const handleResize = () => {
    setMainInitial({
      x: Math.round(window.innerWidth / 2 - 800 / 2),
      y: Math.round(window.innerHeight / 2 - 500 / 2),
    });
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  // open popup
  const handleOpenCard = (cardData) => {
    setOpenCards((prev) => {
      if (prev.some((c) => c.id === cardData.id)) {
        // already open -> bring to front
        bringToFront(cardData.id);
        return prev;
      }
      // assign z-index
      topZRef.current += 1;
      setZIndexes((prevZ) => ({ ...prevZ, [cardData.id]: topZRef.current }));
      return [...prev, cardData];
    });
  };

  const handleCloseCard = (id) => {
    setOpenCards((prev) => prev.filter((c) => c.id !== id));
  };

  const bringToFront = (id) => {
    topZRef.current += 1;
    setZIndexes((prevZ) => ({ ...prevZ, [id]: topZRef.current }));
  };

  // keep main centered on resize using CSS flex container, so no resize listener needed

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        //background: 'linear-gradient(to bottom,  #9ae1e2, #f0f0f0)',
        //backgroundColor: '#d7d7d7ff',
        backgroundImage: `url(${benenegif})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden', // keep page scroll out
      }}
      // prevent page scroll via wheel on background
      onWheel={(e) => {
        // allow background wheel only if no popup content prevents it; otherwise just stop
        // This prevents accidental page scroll in some browsers, but if you prefer to keep page scroll,
        // remove this handler.
      }}
    >
      {/* Decorative star */}
      <img 
        className= 'grow-on-hover filter-drop-shadow' 
        onClick={toggleMusic}
        src={STAR_ICON_URL} 
        title='named it "Zaynosaur"'  
        alt="star" 
        style={{ position: 'absolute', top: 18, left: 18, width: 48 }} />
      <img 
        className= 'grow-on-hover filter-drop-shadow' 
        onClick={playPop}src={sunshine} 
        title='wong really likes u' alt="star" 
        style={{ position: 'absolute', top: 18, left: 100 , width: 48 }} />
      <img 
      className= 'grow-on-hover filter-drop-shadow'
      onClick={playQuack}src={moon} 
      title='still likes u even if u turn into a terrifying cockroach' alt="star" 
      style={{ position: 'absolute', top: 18, left: 182 , width: 48 } } />
      {/* Main centered card (not draggable) */}
      <RetroCard
        id="main"
        title="click stars from left to right"
        initialPosition={mainInitial}
        draggable={false}
        zIndex={900}
        onFocus={() => bringToFront('main')}
        width={800}
        height={500}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1 style={{ color: '#332a51', marginBottom: '5px', margin: '6px' }}>
            <span style={{fontWeight: 300}}>hello!</span> <span style={{ color: '#4f8fc0' }}>Zaynosaur</span>
          </h1>
          <p>wong will drop a bomb and wong feels sorry</p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '90px',  }}>
            {ICON_DATA.map((card) => (
              <ImageLinkIcon 
                key={card.id} 
                label={card.label} 
                onClick={() => handleOpenCard(card)} />
            ))}
          </div>
        </div>
      </RetroCard>

      {/* Render open popups */}
      {openCards.map((card) => (
      <RetroCard
        key={card.id}
        id={card.id}
        title={card.title}
        onClose={handleCloseCard}
        onFocus={bringToFront}
        zIndex={zIndexes[card.id] || 1001}
        initialPosition={{
          x: Math.round(window.innerWidth / 2 + card.offset),
          y: Math.round(window.innerHeight / 2 - (card.height || 300) / 2),
        }}
        draggable={true}
        width={card.width || 360}
        height={card.height || 300}
>
        <div> 
          <p className='align-justify' style={{ marginTop: 0 }}>{card.content1}</p>
          {/*picture render for the first popup */}
          {card.id === "about" && (
            <img
              src={bluestar}
              alt="about me preview"
              style={{
                width: "15%",
                borderRadius: 6,
                marginTop: 0,
                objectFit: "cover",
              }}
            />
          )}
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content2}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content3}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content4}</p>
          {/* poem render for second pop up */}
          {card.id === "links" && (
            <pre className='align-justify'style={{ marginTop: 0, fontStyle: 'italic' }}>{card.poem}</pre>
          )}
          {/* third pop up */}
          {card.id === 'work' && (
            <p classname='impact'
              style={{ 
                position:'center',
                marginTop: 0,
                alignItems:'justifyContent',
                marginBottom:'60px',
                color:'#332a51',
                fontFamily:'Anton',
                fontSize:"250px" }}
            >
                  I LIKE YOU
            </p>
          )}
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content5}</p>
          {/* render gif for third popup */}
          {card.id === 'work' &&(
            <img
              src={thisMuch}
              alt="about me preview"
              style={{
                width: "60%",
                borderRadius: "30px",
                marginTop: 0,
                objectFit: "cover",
              }}
            />
          )}
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content6}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content7}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content8}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content9}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content10}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content11}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content12}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content13}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content14}</p>
          <p className='align-justify'style={{ marginTop: 0 }}>{card.content15}</p>
          {/* long content for scroll testing */}
          {/* {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} style={{ margin: "6px 0" }}>
              Extra line {i + 1} — Lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Praesentium, labore.
            </p>
          ))} */}
        </div>
      </RetroCard>
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: 0,       // 👈 stays at bottom
          left: 0,
          width: '100%',
          height: '270px', // matches your <rect> height
          zIndex: 0,
        }}
      >
        <Wave 
        mask="url(#mask)" fill="#9ae2e1"
        options={{
          height: 30, // wave vertical movement
          amplitude: 13, // wave size
          speed: 0.45, // wave animation speed
          points: 3, // smooth gentle curve
        }}
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="0" stopColor="white" />
              <stop offset="0.5" stopColor="black" />
            </linearGradient>
            <mask id="mask">
              <rect x="0" y="0" width="2000" height="300" fill="url(#gradient)" />
            </mask>
          </defs>
        </Wave>
      </div>
    </div>
    
  );
};

export default App;
