#hamster {
    position: absolute;
    width: 13%;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    animation: hamsterFall 5s linear infinite;
    image-rendering: pixelated;
    opacity: 0;
  }
  
  @keyframes hamsterFall {
    0% { top: -90vh; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    95% { opacity: 0; }
    100% { top: calc(100vh - 5vh); opacity: 0; }
  }