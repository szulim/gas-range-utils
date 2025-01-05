interface group {
  start?: number;
  end?: number;
}

function groupNeighbourNumbers(arrayOfNumbers: number[]) {
  const result = arrayOfNumbers.reduce((accumulator: group[], current, index) => {
    const groups = [...accumulator];

    if (!groups.length) {
      const newGroup = {
        start: current,
        end: current,
      };
      return [newGroup];
    }

    const lastGroup = groups[groups.length - 1];
    const shouldStartNewGroup = lastGroup?.end && current - lastGroup.end > 1;

    if (shouldStartNewGroup) {
      const newGroup = {
        start: current,
        end: current,
      };

      return [...groups, newGroup];
    }

    const continuedGroup = { ...lastGroup, end: current };
    const groupsUpdated = groups.toSpliced(groups.length - 1, 1, continuedGroup);
    return groupsUpdated;
  }, []);
  return result;
}
