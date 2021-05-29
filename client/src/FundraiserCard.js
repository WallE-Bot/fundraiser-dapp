import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FundraiserContract from './contracts/Fundraiser.json';
import Web3 from 'web3';

const FundraiserCard = props => {
  const useStyles = makeStyles({
    card: {
      maxWidth: 450,
      height: 400
    },
    media: {
      height: 140
    },
    button: {
      margin: '5px'
    },
    input: {
      display: 'none'
    }
  });

  const classes = useStyles();
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))

  const [ contract, setContract ] = useState(null)
  const [ accounts, setAccounts ] = useState(null)
  const [ fundName, setFundName ] = useState(null)
  const [ description, setDescription ] = useState(null)
  const [ totalDonations, setTotalDonations ] = useState(null)
  const [ donationCount, setDonationCount ] = useState(null)
  const [ imageURL, setImageURL ] = useState(null)
  const [ url, setURL ] = useState(null)
  const [ modalState, setModalState ] = useState(false);

  useEffect(() => {
    if (props.fundraiser) {
      init(props.fundraiser);
    }
  }, []);

  const init = async fundraiser => {
    try {
      const fund = fundraiser;
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundraiserContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FundraiserContract.abi,
        fund
      );
      setContract(instance);
      setAccounts(accounts);

      const name = await instance.methods.name().call();
      const description = await instance.methods.description().call();
      const totalDonations = await instance.methods.totalDonations().call();
      const imageURL = await instance.methods.imageURL().call();
      const url = await instance.methods.url().call();

      setFundName(name);
      setDescription(description);
      setImageURL(imageURL);
      setTotalDonations(totalDonations);
      setURL(url);
    } catch(error) {
      alert(
        `Failed to load web3, accounts, or contract, Check console for details.`
      );
      console.error(error);
    }
  };

  const toggleModal = () => {
    const currentModalState = modalState;
    setModalState(!currentModalState);
  }

  return (
    <div className='fundraiser-card-content'>
      <Card
        className={classes.card}
        onClick={setModalState}
      >
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={imageURL}
            title="Fundraiser Image"
            component='img'
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {fundName}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size='small'
            color='primary'
            onClick={setModalState}
            variant='contained'
            className={classes.button}
          >
            View More
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default FundraiserCard;
