var connLinesRefs = [];

export const addIntoConnectionLine = (newConnection) => {
  connLinesRefs.push(newConnection);
};

export const removeAllConnectionLine = () => {
  for (let llInd = 0; llInd < connLinesRefs.length; llInd++) {
    try {
      connLinesRefs[llInd].remove();
    } catch (error) {}
  }
};

export const updateConnectionLinePositions = () => {
  for (let llInd = 0; llInd < connLinesRefs.length; llInd++) {
    try {
      connLinesRefs[llInd].position();
    } catch (error) {}
  }
};
