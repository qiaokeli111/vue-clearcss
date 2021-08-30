const ms = function(t) {
  return t.indexOf('ms') > -1 ? parseInt(t, 10) : parseInt(t, 10) * 1000;
};
// this js copy from https://github.com/VitaliyR/postcss-prefix-keyframe for get animation name
module.exports = function(statement) {
  const props = {
    name: null,
    duration: null,
    timingFunction: 'ease',
    delay: 0,
    iterationCount: 1,
    direction: 'normal',
    playState: 'running',
    fillMode: 'none'
  };

  let remainder = statement;

  /* -- Get duration/delay -- */

  const timings = statement.match(/[0-9.]+m?s/g);
  if (timings) {
    props.duration = timings.length > 0 ? ms(timings[0]) : props.duration;
    props.delay	= timings.length > 1 ? ms(timings[1]) : props.delay;

    // Remove the found properties from the string
    remainder = timings.reduce((remainder, cur) => remainder.replace(cur, ''), remainder);
  }

  /* -- Get timing function -- */

  const timingFn = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
  const timingRegexp = new RegExp('(' + timingFn.join('(\\s|$)|') + '|cubic-bezier\\(.*?\\))');
  const timingResults = statement.match(timingRegexp);

  if (timingResults) {
    props.timingFunction = timingResults.length > 0 ? timingResults[0].replace(/\s+/g, '') : props.timingFunction;
    remainder = remainder.replace(props.timingFunction, '');
  }

  /* -- Get iteration count -- */
  const iterationCount = statement.match(/(infinite|\s[0-9]+(\s|$))/);

  if (iterationCount)	{
    props.iterationCount = iterationCount[0].replace(/\s+/g, '');
    remainder = remainder.replace(iterationCount[0], '');
  }

  /* -- Get direction -- */
  const direction = statement.match(/(normal|alternate|alternate-reverse|reverse)\s*/);

  if (direction) {
    props.direction = direction[0].replace(/\s+/g, '');
    remainder = remainder.replace(direction[0], '');
  }

  /* -- Get playState -- */
  const playState = statement.match(/(running|paused)\s*/);

  if (playState) {
    props.playState = playState[0].replace(/\s+/g, '');
    remainder = remainder.replace(playState[0], '');
  }

  /* -- Get playState -- */
  const fillMode = statement.match(/(none|forwards|backwards|both)\s*/);

  if (fillMode) {
    props.fillMode = fillMode[0].replace(/\s+/g, '');
    remainder = remainder.replace(fillMode[0], '');
  }

  remainder = remainder.split(' ').filter(str => str.trim().length);

  if (remainder.length > 0) {
    props.name = remainder[0];
  }

  return props;
};
