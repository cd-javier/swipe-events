function swipeEvent({
  target, // The element that is targeted for the swipe actions
  threshold = 100, // Minimum swipe distance in pixels
  preventScroll = false,
  leftFunction = () => {}, // Functions performed on swipe
  rightFunction = () => {},
  upFunction = () => {},
  downFunction = () => {},
}) {
  if (!target || !(target instanceof HTMLElement)) {
    throw new Error('A valid target element must be provided.');
  }

  let firstTouchX, firstTouchY;

  // Gets coordinates of first touch
  function getFirstTouch(e) {
    if (preventScroll) e.preventDefault();
    firstTouchX = e.touches[0].clientX;
    firstTouchY = e.touches[0].clientY;
  }

  function getLastTouch(e) {
    // Gets coordinates of last touch and calculates difference
    const lastTouchX = e.changedTouches[0].clientX;
    const lastTouchY = e.changedTouches[0].clientY;

    const touchXDiff = firstTouchX - lastTouchX;
    const touchYDiff = firstTouchY - lastTouchY;

    const direction = getSwipeDirection(touchXDiff, touchYDiff, threshold);

    // Performs the function depending on the direction of the swipe
    if (direction === 'left') leftFunction();
    else if (direction === 'right') rightFunction();
    else if (direction === 'up') upFunction();
    else if (direction === 'down') downFunction();
  }

  // Calculates if a swipe has occurred and returns a value
  function getSwipeDirection(touchXDiff, touchYDiff, threshold) {
    if (
      Math.abs(touchXDiff) > Math.abs(touchYDiff) &&
      Math.abs(touchXDiff) > threshold
    ) {
      return touchXDiff > 0 ? 'left' : 'right';
    } else if (
      Math.abs(touchYDiff) > Math.abs(touchXDiff) &&
      Math.abs(touchYDiff) > threshold
    ) {
      return touchYDiff > 0 ? 'up' : 'down';
    }
    return 'no swipe';
  }

  if (preventScroll) {
    target.addEventListener('touchstart', getFirstTouch, { passive: false });
  } else {
    target.addEventListener('touchstart', getFirstTouch, { passive: true });
  }
  
  target.addEventListener('touchend', getLastTouch, { passive: true });

  return function removeSwipe() {
    target.removeEventListener('touchstart', getFirstTouch);
    target.removeEventListener('touchend', getLastTouch);
  };
}

export default swipeEvent;
