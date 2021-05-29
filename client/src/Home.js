import React, { useState, useEffect } from 'react';
import FundraiserCard from './FundraiserCard';
import getWeb3 from './getWeb3';
import FactoryContract from './contracts/FundraiserFactory.json';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const [ funds, setFunds ] = useState([]);
  const [ contract, setContract ] = useState(null);
  const [ accounts, setAccounts ] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = FactoryContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      setContract(instance)
      setAccounts(accounts)

      const funds = await instance.methods.fundraisers(10, 0).call();
      setFunds(funds);
    } catch(error) {
      alert(
        `Failed to load web3, accounts, or contract.  Check console for details.`
      );
      console.error(error);
    }
  }

  const displayFundraisers = () => {
    return funds.map(fundraiser => {
      return (
        <FundraiserCard
          fundraiser={fundraiser}
          key={uuidv4()}
        />
      )
    });
  }

  return (
    <div>
      <h2>Home</h2>
      <div className='main-container'>
        {displayFundraisers()}
      </div>
    </div>
  )
}

export default Home;
