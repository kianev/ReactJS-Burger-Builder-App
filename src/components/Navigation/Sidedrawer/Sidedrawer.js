import React from 'react'
import Logo from '../../Logo/Logo'
import NavigationItems from '../../Navigation/NavigationItems/NavigationItems'
import classes from './Sidedrawer.css'
import Backdrop from '../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/AuxComponent/AuxComponent'

const sideDrawer = (props) => {
  let attachedClasses = [classes.Sidedrawer, classes.Close]
  if (props.open) {
    attachedClasses = [classes.Sidedrawer, classes.Open]
  }

  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed}/>
      <div className={attachedClasses.join(' ')} onClick={props.closed}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems isAuthenticated={props.isAuth}/>
        </nav>
      </div>
    </Aux>
  )
}

export default sideDrawer