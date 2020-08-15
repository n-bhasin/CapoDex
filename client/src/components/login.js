import React from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
// import MetaMaskOnboarding from "@metamask/onboarding";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MetamaskImg from "../images/metamask.png";
import LedgerImg from "../images/ledgerIcon.svg";
import "../App.css";
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
    flexGrow: 1,
  },
  paper: {
    paddingTop: 20,
    marginTop: 70,
    height: 210,
    width: 170,
  },
  control: {
    padding: theme.spacing(2),
  },
  customWidth: { maxWidth: "100vh" },
  text_decoration: { textDecoration: "none" },
}));

export default function LoginPage({ connect }) {
  const classes = useStyles();

  // const handleChange = (event) => {
  //   setSpacing(Number(event.target.value));
  // };

  return (
    // if (!onboarding.current) {
    //   onboarding.current = new MetaMaskOnboarding();
    //   return <Redirect to="/home">
    // }
    <Grid className={classes.root}>
      <h1 style={{ marginTop: 30, marginBottom: 10 }}>WELCOME TO CAPO</h1>
      <p>Connect your wallet and jump into Dex</p>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid container item className={classes.root} justify="center">
            <Router>
              <NavLink to="/home" className={classes.text_decoration}>
                <Paper className={classes.paper} onClick={() => connect()}>
                  <img src={MetamaskImg} height="60" alt="Metamask" />

                  <p style={{ marginTop: 20 }}>
                    Use Your Metamask wallet to connect to Capo
                  </p>
                </Paper>
              </NavLink>
              <NavLink to="/home" className={classes.text_decoration}>
                <Paper
                  className={classes.paper}
                  style={{ marginLeft: 20, backgroundColor: "black" }}
                >
                  <img src={LedgerImg} alt="LedgerImg" height="60"></img>
                  <br />
                  <p style={{ color: "white", marginTop: 20 }}>
                    Use Your Ledger hardware wallet to connect to Capo
                  </p>
                </Paper>
              </NavLink>
            </Router>
          </Grid>
          <Grid
            item
            container
            className={classes.customWidth}
            style={{ marginTop: 70 }}
          >
            <p>
              By unlocking Your wallet You agree to our Terms of Service and
              Cookie Policy
            </p>
            <br />
            <p>
              {" "}
              <strong>Disclaimer: </strong>Wallets are provided by External
              Providers and by selecting you agree to Terms of those Providers.
              Your access to the wallet might be reliant on the External
              Provider being operational.
            </p>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
