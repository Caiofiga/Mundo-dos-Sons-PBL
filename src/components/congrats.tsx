import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import  { Fireworks } from '@fireworks-js/react'
import "../css/congrats.css"

export function GetConfetti() {
    const { width, height } = useWindowSize();
    const gravity = 0.1;
    const numberOfPieces = 1000;
    const confettiSource = {
      x: 0,
      y: 0,
      w: width,
      h: height
    };
    const recycle = false;
    return <Confetti 
    width={width}
    height={height}
    numberOfPieces={numberOfPieces}
    confettiSource={confettiSource}
    recycle={recycle}
    gravity={gravity}
    />;
  }
  
  export function GetFireworks() {
    return (
        
        <Fireworks
          options={{
            rocketsPoint: {
              min: 0,
              max: 100
            }
          }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
            background: 'transparent',
            zIndex: 0
          }}
        />
      )
  }
  
    export function GetStars() {
        return(
            <>
            <span className="stars star1">
              ★
            </span>
            <span className="stars star2">
              ★
            </span>
            <span className="stars star3">
              ★
            </span>
          </>
        )
    } 

