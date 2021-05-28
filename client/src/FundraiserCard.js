import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
  });

  const classes = useStyles();
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

  const [ contract, setContract ] = useState(null)
  const [ accounts, setAccounts ] = useState(null)
  const [ fundName, setFundName ] = useState(null)
  const [ description, setDescription ] = useState(null)
  const [ totalDonations, setTotalDonations ] = useState(null)
  const [ donationCount, setDonationCount ] = useState(null)
  const [ imageURL, setImageURL ] = useState(null)
  const [ url, setURL ] = useState(null)

  useEffect((fundraiser) => {
    if(fundraiser) {
      init(fundraiser);
    }
  }, [{}]);

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

  return (
    <div className='fundraiser-card-content'>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={props.fundraiser.image}
            title="Fundraiser Image"
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {fundName}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              <p>{description}</p>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size='small' color='primary'>
            View More
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default FundraiserCard;
