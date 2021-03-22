const axios = require('axios');
const fetch = require("node-fetch");

const pools = require('../../../data/autoPools.json');
const { compound } = require('../../../utils/compound');
const { BASE_HPY } = require('../../../../constants');

const getAutoApys = async () => {
  let apys = {};

  const autoStats = await fetchAutoStats();

  const values = pools.map(pool => {
    const poolStat = autoStats[pool.poolId];

    const apr = Number(poolStat['APR']);
    console.log('auto apr',apr);
    const aprAuto = Number(poolStat['APR_AUTO']);
    const apy = compound(apr + aprAuto, BASE_HPY, 1, 0.955);

    return { [pool.name]: apy };
  });

  for (item of values) {
    apys = { ...apys, ...item };
  }

  return apys;
};

const fetchAutoStats = async () => {
  let autoPools;
  const response = await fetch(
    'https://api.autofarm.network/bsc/get_farms_data',
    {method: 'GET',
    headers:{'Content-Type': 'application/json'},}
  );
  response
    .json()
    .then(response=>{
      console.log('auto res: ',response.pool[1]);
      autoPools = response.pools;
      return autoPools;
    }).catch(err=>{console.error('fetchAutoStats error:', err);
    return 0;})
};

module.exports = getAutoApys;
