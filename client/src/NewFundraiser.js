import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import getWeb3 from './getWeb3';
import FactoryContract from './contracts/FundraiserFactory.json';

const NewFundraiser = () => {
  const [ name, setFundraiserName ] = useState(null);
  const [ website, setFundraiserWebsite ] = useState(null);
  const [ description, setFundraiserDescription ] = useState(null);
  const [ imageURL, setImage ] = useState(null);
  const [ address, setAddress ] = useState(null);
  const [ custodian, setCustodian ] = useState(null);
  const [ contract, setContract ] = useState(null);
  const [ accounts, setAccounts ] = useState(null);
  const [ funds, setFunds ] = useState(null);

  useEffect(() => {
    init();
  }, []);
  
  const init = async () => {
    try {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = FactoryContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      console.log(deployedNetwork.address);
      const instance = new web3.eth.Contract(
        FactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log(instance, accounts)
      setContract(instance)
      setAccounts(accounts)

      const funds = await instance.methods.fundraisers(10,0).call();
      setFunds(funds);
    } catch(error) {
      alert(
        `Failed to load web3, accounts, or contract.  Check console for details.`
      );
      console.error(error);
    }
  }

  const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2),
    },
    dense: {
      marginTop: theme.spacing(2),
    },
    menu: {
      width: 200,
    },
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none'
    }
  }));

  const classes = useStyles();

  const handleSubmit = async () => {
    console.log(contract)
    await contract.methods.createFundraiser(
      name,
      website,
      imageURL,
      description,
      custodian
    ).send({ from: accounts[0] })

    alert('Successfully created fundraiser');
  }

  return (
    <div>
      <h2>Create a New Fundraiser</h2>
      <label>Name</label>
      <TextField
        id='outlined-bare'
        className={classes.textField}
        placeholder='Fundraiser Name'
        magin='normal'
        onChange={e => setFundraiserName(e.target.value)}
        variant='outlined'
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>Website</label>
      <TextField
        id='outlined-bare'
        className={classes.textField}
        placeholder='Fundraiser Website'
        magin='normal'
        onChange={e => setFundraiserWebsite(e.target.value)}
        variant='outlined'
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>Description</label>
      <TextField
        id='outlined-bare'
        className={classes.textField}
        placeholder='Fundraiser Description'
        magin='normal'
        onChange={e => setFundraiserDescription(e.target.value)}
        variant='outlined'
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>Image</label>
      <TextField
        id='outlined-bare'
        className={classes.textField}
        placeholder='Fundraiser Image'
        magin='normal'
        onChange={e => setImage(e.target.value)}
        variant='outlined'
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>Address</label>
      <TextField
        id='outlined-bare'
        className={classes.textField}
        placeholder='Fundraiser Ethereum Address'
        magin='normal'
        onChange={e => setAddress(e.target.value)}
        variant='outlined'
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>Custodian</label>
      <TextField
        id='outlined-bare'
        className={classes.textField}
        placeholder='Fundraiser Custodian'
        magin='normal'
        onChange={e => setCustodian(e.target.value)}
        variant='outlined'
        inputProps={{ 'aria-label': 'bare' }}
      />

      <Button
        onClick={handleSubmit}
        variant='contained'
        className={classes.button}
      >
        Submit
      </Button>
    </div>
  )
}

export default NewFundraiser;
