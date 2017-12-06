import React, {Component} from 'react';
import Aux from '../../../hoc/AuxComponent/AuxComponent';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
  render(){
    const ingredientSummary = Object.keys(this.props.ingredients)
      .map(inKey => {
        return <li key={inKey}>
          <span style={{textTransfrom: 'capitalize'}}>{inKey}</span>: {this.props.ingredients[inKey]}
        </li>
      })

    return(
      <Aux>
        <h3>Your Order</h3>
        <p>A delicious burger with following ingredients: </p>
        <ul>
          {ingredientSummary}
        </ul>
        <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
        <p>Continue to Checkout?</p>
        <Button btnType="Danger" clicked={this.props.purchaseCanceled}>CANCEL</Button>
        <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
      </Aux>
    );
  }
};

export default OrderSummary;
