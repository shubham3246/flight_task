const spaceXData = async () => {
  try {
    const response = await fetch('https://api.spacexdata.com/v3/launches');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching SpaceX data:', error);
    return null;
  }
};

export default spaceXData;
