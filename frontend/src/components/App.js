import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Home from './Home';
import Loader from './Loader';
import Error from './Error';
import { Router, Route, Switch } from 'react-router-dom';
import { history } from 'store';
import themeSelector, { isDarkSelector } from 'selectors/theme';
import { CssBaseline } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: { paddingTop: 150 },
}));

function Component({ error, isLoaded, theme, isDark }) {
  const classes = useStyles();

  React.useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains(isDark ? 'light' : 'dark')) {
      root.classList.remove(isDark ? 'light' : 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  let pane;
  if (error) {
    pane = <Error {...{ error }} />;
  } else if (isLoaded) {
    pane = (
      <div className="flex-grow">
        <Header />
        <Switch>
          <Route path={'/'} component={Home} />
        </Switch>
      </div>
    );
  } else {
    pane = <Loader fullscreen />;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router {...{ history }}>
        <div className={classes.container}>{pane}</div>
      </Router>
    </ThemeProvider>
  );
}

export default connect(state => {
  const { app } = state;
  const { isLoaded, error } = app;
  let err;
  if (error) {
    console.log(error);
    err = error.message || 'Error Loading Application!';
  }

  return {
    isLoaded,
    error: err,
    theme: themeSelector(state),
    isDark: isDarkSelector(state),
  };
}, mapDispatchToProps)(Component);
